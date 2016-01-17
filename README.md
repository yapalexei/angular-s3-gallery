# angular-s3-gallery

Because sharing on dropbox is too easy I decided to build my own dropbox-ish app using Nodejs, Angularjs, AWS S3 and AWS 
lambda. 

## The Problem:
Share 250+ photos with friends and/or family/acquaintances/colleagues in a mobile friendly, scalable, extendable manner. 
This has to be done in such a way that only requires the end user to simply upload the raw images (be it jpg or png) at any size.
The result would be that the system would resize and place the image back to be accessed by the app to display in a grid fashion.
 
## Some Preliminary Thoughts and Challenges:
At first glance this process would require two separate components; an image processor and a client. The image processor will have 
to take the images and resize them, give them a new unique name (or at least a suffix) and place them were they can be listed to a client.
The client, will simply display the thumbnails and provide a link to the original/larger size once available. 

The client would have to know how to read xml because a `s3:ListBucket` call returns in xml, usually. This call would be returning
ONLY the thumbnails. This call would also give the application some insight on where to fetch the  original/larger sizes. The file 
structure would be separated into two buckets. One would be the upload bucket and the other the thumbs bucket. 
 
The "Upload Bucket" is where all the originals would be uploaded as well as the larger files be converted to if at all. The 
"Thumbs Bucket" would just have the thumbnails. The reason for this is that the call for thumbnails should be small and light. Perhaps a
better solution would have been to use an api of sorts but I didn't want to build an api for something like this yet.

So to sum it up, there are three things that I need; a file storage area (S3), an image processor (Nodejs Lambda function) and a client 
that reads it all (Angularjs served on Nodejs/Expressjs). 

## Present Setup:
The code above is the client side of my rant. The lambda function repo link will come soon with more details.

## Environment:

* OS:             `OSX 10.10.5 (14F27)`
* Nodejs Version: `v4.2.4`
* NPM Version:    `2.14.12`
* Bower Version:  `1.7.1`

**Note:** The OS can also be linux since I deploy this to Amazons ec2 instance that runs their basic `Linux AMI` build.

### For Previewing

Run `grunt` for building and `grunt serve` for preview.
**Note:** This will not work by simply installing on your setup one must change the buckets to point to your own that also have
an appropriate CORS and bucket policy configured on them. 

#### The "Upload Bucket" policy would have to look something like (use the generator for this):
```
{
	"Version": "2012-10-17",
	"Id": "some_policy_id",
	"Statement": [
		{
			"Sid": "statement_id",
			"Effect": "Allow",
			"Principal": "*",
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::<some upload bucket name>/*"
		}
	]
}
```

#### "Uploads Bucket" CORS Config:
```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>http://your-special-domain.com</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
        <ExposeHeader>MaxAgeSeconds</ExposeHeader>
        <AllowedHeader>Access-Control-Allow-Origin</AllowedHeader>
        <AllowedHeader>ETag</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```

#### The "Thumbs Bucket" policy would have to look something like:
```
{
	"Version": "2012-10-17",
	"Id": "some_policy_id",
	"Statement": [
	    {
            "Sid": "statement_id_1",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::<some thumbs bucket name>"
        },
		{
			"Sid": "statement_id_2",
			"Effect": "Allow",
			"Principal": "*",
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::<some thumbs bucket name>/*"
		}
	]
}
```

#### "Thumbs Bucket" CORS Config:
```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>http://your-special-domain.com</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
        <ExposeHeader>MaxAgeSeconds</ExposeHeader>
        <AllowedHeader>Access-Control-Allow-Origin</AllowedHeader>
        <AllowedHeader>ETag</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```


## Licensing

   The MIT License (MIT)
   
   Copyright (c) 2016 yapalexei
   
   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:
   
   The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.
   
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   SOFTWARE.

