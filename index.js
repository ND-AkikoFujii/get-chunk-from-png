export const getChunkFromPng = (pngFile, chunkName) => {
  const fileReader = new FileReader()
  const returnData = []
  let decodeData
  fileReader.addEventListener('load', () => {
    decodeData = fileReader.result

    // pngをバラす
    const uint8 = new Uint8Array(decodeData)

    const getChunkData = (chunkName) => {
      // チャンク名を一文字ずつASCIIコードにする
      const chunkNameArr = []
      for(let i in chunkName){
        chunkNameArr.push(chunkName.charCodeAt(i))
      }
      // pngのバイナリから一文字目の位置を探す
      const cIndex = uint8.findIndex((item, index, arr) => {
        if(item === chunkNameArr[0] && arr[index + 1] === chunkNameArr[1] && arr[index + 2] === chunkNameArr[2] && arr[index + 3] === chunkNameArr[3]) return true
      })
      if (cIndex === -1) return []
      // チャンク名の手前4バイト（データ長）を取得する
      const cLengthArr = uint8.slice(cIndex - 4, cIndex)
      // それぞれ2進数に変換して結合する
      let cLengthStr = ''
      for (let item of cLengthArr) {
        cLengthStr += item.toString(2)
      }
      // 2進数の文字列を10進数の数値に変換
      const cLength = parseInt(cLengthStr, 2)
      // cLength分のdataを取る
      const cData = uint8.slice(cIndex + 4, cIndex + 4 + cLength)
      // CRCを取る
      const cCrc = uint8.slice(cIndex + 4 + cLength, cIndex + 4 + cLength + 4)

      // 開始点からデータ長（4）、チャンク名（4）、データ（可変）、CRC（4）までのバイナリを返す
      const targetChunkData = uint8.slice(cIndex - 4, (cIndex - 4) + cLength + 12)
      return targetChunkData
    }
    returnData = getChunkData(chunkName)
  })
  fileReader.readAsArrayBuffer(pngFile)
  console.log(returnData)
  return returnData
}