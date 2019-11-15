Useful Docker commands
docker ps -> View running containers
docker images -> View all images
docker rm :id -> Remove a container
docker rmi :id -> Remove a image
docker stop --time 10 container :id -> Stop running container 

Build Docker by 
docker build -t ict3102 .

Run image by // 8080 is the public port to access to private port 3000 listener inside the container
docker run -p 8080:3000 -d ict3102