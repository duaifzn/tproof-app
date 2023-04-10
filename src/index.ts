import * as pki from './service/pki';
import { readFileSync, appendFileSync, readdirSync } from "fs";
import { ipcRenderer } from 'electron';
import { IpcChannel, selectDirDto } from './dto/ipcDto';

import { logger } from './service/logger'
import { performance } from 'perf_hooks';
import * as os from 'os';
import Swal from 'sweetalert2';


ipcRenderer.on(IpcChannel.selectDir, (event, arg) =>{
    let res = arg as selectDirDto
    if(arg.selectPath){
        (document.getElementById(res.sender) as HTMLInputElement).value = res.selectPath
    }else{
        (document.getElementById(res.sender) as HTMLInputElement).value = null
    } 
})

document.getElementById('selectFileBtn').addEventListener('click', () =>{
    ipcRenderer.send(IpcChannel.selectDir, 'selectFile')
})

document.getElementById('privateKeyBtn').addEventListener('click', () =>{
    ipcRenderer.send(IpcChannel.selectDir, 'privateKey')
})

document.getElementById('encryptBtn').addEventListener('click', () =>{
    try{
        if(!inputValidate()){
            return
        }
        const privateKeyPath = (document.getElementById('privateKey') as HTMLInputElement).value
        let selectFilePath = (document.getElementById('selectFile') as HTMLInputElement).value
        const privateKey = readFileSync(`${privateKeyPath}`, 'utf8');
        const selectFile = readFileSync(`${selectFilePath}`);
        const encrypted = pki.sign(privateKey, selectFile).toString('hex');
        (document.getElementById('encryptData') as HTMLInputElement).value = encrypted 
        // reset()
        sweetAlertSuccess(`檔案簽章成功!!`)

    }catch(err){
        logger.error(`${err}`)
        sweetAlertError(`${err}`)
    }
})

function inputValidate(): Boolean{
    if(!(document.getElementById('privateKey') as HTMLInputElement).value){
        sweetAlertError('缺少私鑰!!')
        return false
    }
    if(!(document.getElementById('selectFile') as HTMLInputElement).value){
        sweetAlertError('缺少檔案!!')
        return false
    }
    return true
}

document.getElementById('copyEncryptBtn').addEventListener('click', async () =>{
    let text = (document.getElementById('encryptData')as HTMLInputElement).value;
    try {
        await navigator.clipboard.writeText(text);
        sweetAlertSuccess("已複製")
    } catch (err) {
        sweetAlertError(err)
    }
})



function reset(){
    // (document.getElementById('uploadFile') as HTMLInputElement).value = null;
}

function getFileNameWithOS(path: string){
    const osPlatform = os.platform();
    if(osPlatform === 'win32'){
        return path.split(`\\`).pop();
    }
    else if(osPlatform === 'linux'){
        return path.split(`/`).pop();
    }else{
        return path.split(`/`).pop();
    }
}

function sweetAlertError(msg: string){
    Swal.fire({
        title: '錯誤',
        text: msg,
        icon: 'error',
        confirmButtonText: '確定',
        confirmButtonColor: '#0d6efd',
    })
}

function sweetAlertSuccess(msg: string){
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'success',
        title: msg
      })
}