import fs = require('fs/promises')
import callbackFs = require('fs')
const developName = 'src'
const productName = 'public'
const firstPath = `./${developName}/`

/**
 * 公開ファイル領域を初期化
 * @returns {Promise<void>}
 */
const initProduct = async () => {
  if (callbackFs.existsSync(`./${productName}`)) {
    await fs.rm(`./${productName}`, {
      recursive: true
    })
  }
  await fs.mkdir(`./${productName}`)
}

/**
 * txt拡張子のファイルを圧縮する
 * @param srcFilePath 圧縮対象の開発用ファイルパス
 * @param buildFilePath 書き出し用のファイルパス
 * @returns {Promise<void>}
 */
const txtGenerator = async (srcFilePath: string, buildFilePath: string) => {
  const content = await fs.readFile(srcFilePath)
  await fs.writeFile(buildFilePath, content.toString().replace(/\n/g, '').replace(/\s/g, ''))
}

/**
 * 再帰的にディレクトリを巡回してファイル及びディレクりをproductフォルダに出力する
 * @param dir 
 * @returns {Promise<void>}
 */
const recursionScanning = async (dir: string) => {
  const files: string[] = await fs.readdir(dir)

  files.forEach(async (file: string) => {
    const productPath = `${dir.replace(`./${developName}`, `./${productName}`)}${file}`

    // 対象ファイルが拡張子を持たない場合はディレクトリと判定
    if (!file.includes('.')) {
      if (!callbackFs.existsSync(`${productPath}`)) {
        await fs.mkdir(`${productPath}`)
      }
      await recursionScanning(`${dir}${file}/`)
    } else {
      await txtGenerator(`${dir}${file}`, productPath)
    }
  })
}

(async() => {
  await initProduct();
  recursionScanning(firstPath);
})();
