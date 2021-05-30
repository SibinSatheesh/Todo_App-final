import * as React from 'react';
import { useState } from 'react';
import {
  StyleSheet, Modal,
  Text,
  View, PermissionsAndroid,
  Alert,
  KeyboardAvoidingView

} from 'react-native';
import {TextInput,  Button} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';

const Update = ({navigation,route})=>{
    const getDetails = (type) =>{
        if (route.params){
            switch(type){
                case "name":
                    return route.params.name
                case "position":   
                    return route.params.position  
                case "email":   
                    return route.params.email    
                case "phone":   
                    return route.params.phone
                case "picture":   
                    return route.params.picture
            }
        }
        return ""
    }
    if(route.params){
        console.log(route.params)
    }

    const [name,setName] = useState(getDetails("name"))
    const [position,setPosition] = useState(getDetails("position"))
    const [email,setEmail] = useState(getDetails("email"))
    const [phone,setPhone] = useState(getDetails("phone"))
    const [picture,setPicture] = useState(getDetails("picture"))
    const [modal,setModal] = useState(false)
    
    const pickFromCamera = async () => {
        try {
            
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "Cool Photo App Camera Permission",
              message:
                "Cool Photo App needs access to your camera " +
                "so you can take awesome pictures.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the camera");
            ImagePicker.openCamera({
                width: 300,
                height: 400,
                cropping: true
              }).then(image => {

                let data = {
                    uri:image.path,
                    type:`test/${image.path.split(".")[4]}`,
                    name:`test.${image.path.split(".")[4]}`
                }
                handleUpload (data)
                console.log(data);
                // setPicture(image.path);
                setModal(false)
            }).catch(err => {
                console.log("Image not selected")
                })
          } else {
            console.log("Camera permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      };


const pickFromGallery = async () => {

try {
            
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: "Cool Photo App Camera Permission",
              message:
                "Cool Photo App needs access to your camera " +
                "so you can take awesome pictures.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can access the Gallery");

             ImagePicker.openPicker({ 
                width: 300,
                height: 400,
                cropping: true
              }).then(image => {

                let data = {
                    uri:image.path,
                    type:`test/${image.path.split(".")[4]}`,
                    name:`test.${image.path.split(".")[4]}`
                }
                handleUpload (data)
                console.log(data);
                // setPicture(image.path);
                setModal(false)
                }).catch(err => {
                   console.log("Image not selected")
                   })
          } else {
            console.log("Gallery permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      };

      const handleUpload =(image)=>{
        const data = new FormData()
        data.append('file',image)
        data.append('upload_preset','userTodoapp')
        data.append("cloud_name","dbiz9phrb")
        // console.log(data)
        fetch("https://api.cloudinary.com/v1_1/dbiz9phrb/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
         console.log(data.secure_url)
            setPicture(data.secure_url)
        })

    }

    const updatedData = ()=>{
        fetch("http://10.0.2.2:3000/update",{
            method:"post",
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                id: route.params._id,
                name,
                position,
                email,
                phone,
                picture
            })
        })
        .then(res=>res.json())
        .then(data =>{
            Alert.alert(`${data.name} is updated successfully`)
            navigation.navigate("Home")
        }).catch(err=>{
            Alert.alert("Something went wrong")
        })
    }

    return (
        <View>
            <KeyboardAvoidingView behavior="position">

            <View style={styles.addView}>
                <Text style={styles.addText}>
                    EDIT DETAILS
                </Text>
            </View>
            
            <TextInput
                label="Name"
                value={name}
                theme={theme}
                style={styles.inputStyle}
                mode= "outlined"
                onChangeText= {text => setName(text)}
            />
                
            <TextInput
                label="Position"
                value={position}
                theme={theme}
                style={styles.inputStyle}
                mode= "outlined"
                onChangeText= {text => setPosition(text)}
            />

            <TextInput
                label="Email"
                value={email}
                theme={theme}
                style={styles.inputStyle}
                mode= "outlined"
                onChangeText= {email => setEmail(email)}
            />

            <TextInput
                label="Phone"
                value={phone}
                theme={theme}
                style={styles.inputStyle}
                mode= "outlined"
                onChangeText= {text => setPhone(text)}
            />
               <Button 
                    style={styles.inputStyle}
                    theme={theme}
                    color='#008b8b'
                    icon={picture==""?"upload":"check"}
                    mode="contained"
                    onPress={() => setModal(true)}>
                       Upload Image
                </Button>

               

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modal}
                    onRequestClose={()=>{
                        setModal(false)
                    }}
                >
                    <View style={styles.modalView}>
                        <View style={styles.modalButtonView}>
                            <Button 
                                theme={theme}
                                color='#008b8b'
                                icon="camera"
                                mode="contained"
                                onPress={() => pickFromCamera()}
                                >
                                    Camera
                            </Button>
                            <Button 
                                theme={theme}
                                color='#008b8b'
                                icon="image-area"
                                mode="contained"
                                onPress={() => pickFromGallery()}
                                >
                                    Gallery
                            </Button>

                        </View>
                            <Button 
                                theme={theme}
                                color='#008b8b'
                                icon="camera"
                                onPress={() => setModal(false)}>
                                  cancel
                            </Button>
                           
                           
                    </View>
                </Modal>

            <Button
                onPress={() => updatedData()}
                style={styles.addButton}
                icon="account-edit"
                mode="contained">
                    Update
            </Button>
            </KeyboardAvoidingView>
        </View>
    )
}

const theme= {
    colors:{
        primary:"#008b8b"
    }
}

const styles = StyleSheet.create({
    root:{
        flex:1,
    }, 
     
    inputStyle:{
        margin:5,
        padding: 0,
        color:'#ff1493'
    },

    addText:{
        color:'#2f4f4f',
        fontSize:20,
        marginBottom:20
    },

    addView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:60
    },
    
    addButton:{
        width: '40%',
        marginLeft: '30%',
        marginTop:'4%',
        backgroundColor:'#008b8b',
    },
    modalView:{
        position:'absolute',
         bottom:2,
         width:"100%",
         backgroundColor:'#dcdcdc',
     },
    modalButtonView:{
        flexDirection:"row",
        justifyContent:"space-around",
        padding:10,
        
    }
})

export default Update