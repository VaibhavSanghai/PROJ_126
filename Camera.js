import * as React from "react";
import {Button, View, Platform} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class PickImage extends React.Component {
    state = {
        image: null
    }
    render(){
        return(
            <View style={{ flex: 1, alignItems: "center", justifyContent:"center"}}>
                <Button 
                    title="Pick an image from camera roll"
                    onPress={this._pickImage}
                />
            </View>
        )
    }
    getPermissionAsync = async () => {
        if (Platform.OS !== "web") {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert("Sorry, we need camera roll permission to make this work!")
            }
        }
    }
    componentDidMount(){
        this.getPermissionAsync(); 
    }
    PickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.ALL, 
                allowsEditing: true, 
                aspect: [4, 3], 
                quality: 1
            })
            if (!result.cancelled) {
                this.setState({ image: result.data });
                console.log(result.uri)
                this.uploadImage(result.uri)
            }
        } catch (E) {
            console.log(E); 
        }
    }
    uploadImage = async (uri) => {
        const data = new FormData()
        let filename  = uri.split("/")[uri.split("/").length - 1]
        let type = `image/${uri.split(".")[uri.split(".").length - 1]}`
        const fileToUpload = {
            uri: uri, 
            name: filename, 
            type: type,
        }; 
        data.append("digit", fileToUpload);
        fetch("https://07afd951a187.ngrok.io/predict-digit", {
            method: "POST", 
            body: data, 
            headers: {
                "content-type": "multipart/form-data", 
            }, 
        })
        .then((response) => response.json())
        .then((result) => {
            console.log("Success : ", result); 
        })
        .catch((error) => {
            console.error("Error : ", error)
        })
    }
}