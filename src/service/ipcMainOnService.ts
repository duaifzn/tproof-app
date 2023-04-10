import { dialog, IpcMainEvent } from 'electron'
import { IpcChannel } from '../dto/ipcDto'
import { selectDirDto } from '../dto/ipcDto'
// const PORTABLE_EXECUTABLE_DIR = process.env.PORTABLE_EXECUTABLE_DIR?process.env.PORTABLE_EXECUTABLE_DIR+'\\':'';

export async function selectDir(event: IpcMainEvent, arg: any){
  console.log(arg)
    const sender = arg
    const result = await dialog.showOpenDialog({
      properties: ['openFile']
    })
    console.log('directories selected', result.filePaths)
    const res: selectDirDto = {
      sender: sender,
      selectPath: result.filePaths[0]
    }
    event.reply(IpcChannel.selectDir, res)
}