pipeline {
    agent { label 'built-in' }

    environment {
        BACKEND_REPO = "https://github.com/Rehtegot47/Eventify.git"
        APP_NAME = "eventify"
        LOCAL_DOMAIN = "localhost:8080"
    }

    stages {
        stage('Checkout Frontend') {
            steps {
                echo 'Frontend code already checked out by SCM'
            }
        }

        stage('Clone Backend') {
            steps {
                sh 'rm -rf PTicketing'
                sh 'git clone --depth 1 ${BACKEND_REPO} PTicketing'
            }
        }

        stage('Build Backend (Docker Maven)') {
            steps {
                sh '''
                    docker run --rm \\
                        -v "$WORKSPACE/PTicketing":/app \\
                        -v maven-cache:/root/.m2 \\
                        -w /app \\
                        maven:3.9-eclipse-temurin-21 \\
                        mvn clean package -DskipTests
                '''
            }
        }

        stage('Build Frontend (Docker Node)') {
            steps {
                sh '''
                    docker run --rm \\
                        -v "$WORKSPACE":/workspace \\
                        -w /workspace \\
                        node:20-alpine \\
                        sh -c "npm install && npm run build"
                '''
            }
        }

        stage('Package Static Files') {
            steps {
                sh 'mkdir -p PTicketing/src/main/resources/static'
                sh 'cp -r dist/* PTicketing/src/main/resources/static/'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${APP_NAME}:latest -f PTicketing/Dockerfile.cloudrun PTicketing'
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker rm -f ${APP_NAME}-ci 2>/dev/null || true'
                sh 'docker run -d --name ${APP_NAME}-ci -p 8080:8080 ${APP_NAME}:latest'
            }
        }
    }

    post {
        success {
            echo 'BUILD SUCCESS - Eventify running at http://${LOCAL_DOMAIN}'
        }
        failure {
            echo 'BUILD FAILED - check the logs above'
        }
    }
}