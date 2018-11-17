import cloudinary from 'cloudinary'

const cloudinaryAPIkey = process.env.REACT_APP_CLOUDINARY_API_KEY
const cloudinaryAPIsecret = process.env.REACT_APP_CLOUDINARY_API_SECRET
const cloudinaryUploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET

cloudinary.config({ 
  cloud_name: 'evoppo', 
  api_key: cloudinaryAPIkey, 
  api_secret: cloudinaryAPIsecret 
})
export const uploadWidget = (callback) => {
  window.cloudinary.openUploadWidget({ cloud_name: 'evoppo', upload_preset: cloudinaryUploadPreset },
    (error, result) => {
      callback(result[0].path)
      window.location.reload()
    })
}