export enum IpcChannel {
    selectDir = 'selectDir',
} 
export interface selectDirDto {
    sender: string,
    selectPath: string,
}