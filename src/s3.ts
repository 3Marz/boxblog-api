import S3 from "aws-sdk/clients/s3"
import fs from "fs"

const wasabi_bucket_name = process.env.WASABI_BUCKET_NAME
const wasabi_access_key = process.env.WASABI_ACCESS_KEY
const wasabi_private_key = process.env.WASABI_PRIVATE_KEY
const wasabi_endpoint = process.env.WASABI_ENDPOINT

const s3 = new S3({
	endpoint: wasabi_endpoint,
	accessKeyId: wasabi_access_key,
	secretAccessKey: wasabi_private_key
})


export function uploadFile(filePath: string, key: string) {
	const fileStrem = fs.createReadStream(filePath)

	const uploadParams = {
		Bucket: wasabi_bucket_name,
		Key: key,
		Body: fileStrem
	}
	
	return s3.upload(uploadParams as S3.Types.PutObjectRequest).promise()
}

export function getFileStrem(fileKey: string) {
	const downloadParams = {
		Key: fileKey,
		Bucket: wasabi_bucket_name
	}
	
	return s3.getObject(downloadParams as S3.Types.GetObjectRequest).createReadStream()
}

export function deleteFile(fileKey: string) {
	const deleteParams = {
		Key: fileKey,
		Bucket: wasabi_bucket_name
	}
	
	return s3.deleteObject(deleteParams as S3.Types.DeleteObjectRequest).promise()
}

//
//(async () => { 
//	const result = await uploadFile("uploads/1730650646960-profile.jpg") 
//	console.log(result)
//})()

