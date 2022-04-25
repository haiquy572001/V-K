import {StyleSheet, Text, View, FlatList, TextInput} from 'react-native';
import React, {useState, useEffect} from 'react';
import socketIO from 'socket.io-client';
import Smartconfig from 'react-native-smartconfig';

const App = () => {
  const [message, setMessage] = useState('');
  const [listMessages, setListMessages] = useState([]);
  const [socket, setSocket] = useState();

  const connectWifi = async () => {
    Smartconfig.start({
      type: 'esptouch', //or airkiss, now doesn't not effect
      ssid: 'wifi-network-ssid',
      bssid: 'filter-device', //"" if not need to filter (don't use null)
      password: 'wifi-password',
      timeout: 50000, //now doesn't not effect
    })
      .then(function (results) {
        //Array of device success do smartconfig
        console.log(results);
        /*[
        {
          'bssid': 'device-bssi1', //device bssid
          'ipv4': '192.168.1.11' //local ip address
        },
        {
          'bssid': 'device-bssi2', //device bssid
          'ipv4': '192.168.1.12' //local ip address
        },
        ...
      ]*/
      })
      .catch(function (error) {});

    Smartconfig.stop();
  };

  const connectSocket = async () => {
    try {
      const socket = socketIO('http://192.168.31.253:5000', {
        transports: ['websocket'],
        jsonp: false,
      });
      socket.connect();
      socket.on('connect', () => {
        console.log('connected to socket server');
      });
      setSocket(socket);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {
    handleChangeSocket();
  }, [socket]);

  const handleChangeSocket = () => {
    try {
      if (socket) {
        socket.on('server_send_message', data => {
          listMessages.push(data);
        });
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleSendMessage = () => {
    try {
      if (message) {
        socket.emit('send_message', message);
        setMessage('');
      }
    } catch (error) {}
  };

  const renderContent = item => {
    return <Text style={{color: 'black'}}>{item.message}</Text>;
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TextInput
        value={message}
        onChangeText={setMessage}
        style={{height: 40, width: '100%', borderWidth: 1}}
        onSubmitEditing={handleSendMessage}
      />

      <FlatList
        style={{flex: 1, backgroundColor: 'white'}}
        data={listMessages}
        keyExtractor={item => item.id}
        renderItem={({item}) => renderContent(item)}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
