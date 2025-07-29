# React + TypeScript + Vite

## To run (only) the frontend with docker

1. Change directories to the frontend directory

    ```bash
    cd frontend
    ```

2. build docker container

    ```bash
    docker build -t my-frontend .
    ```

3. run docker container

    ```bash
    docker run -p 5173:5173 my-frontend
    ```

## To run the entire application using docker, please refer to the README at the root level of the project
