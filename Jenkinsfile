pipeline {
    agent any
    triggers {
        githubPush()
    }

    environment {
        REGISTRY = '172.21.33.225:5000'
        APP_SERVER = '172.21.33.238'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh """
                        ${tool 'SonarScanner'}/bin/sonar-scanner \
                            -Dsonar.projectKey=sofit-frontend \
                            -Dsonar.sources=user-front/src,admin-front/src \
                            -Dsonar.exclusions=**/node_modules/**,**/dist/**
                    """
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                sh '''
                    docker build --no-cache -t $REGISTRY/sofit-user-front:latest -f user-front/Dockerfile .
                    docker push $REGISTRY/sofit-user-front:latest

                    docker build --no-cache -t $REGISTRY/sofit-admin-front:latest -f admin-front/Dockerfile .
                    docker push $REGISTRY/sofit-admin-front:latest
                '''
            }
        }

        stage('Deploy') {
            steps {
                sshagent(['sofit-app-ssh']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@$APP_SERVER "
                            docker pull $REGISTRY/sofit-user-front:latest &&
                            docker pull $REGISTRY/sofit-admin-front:latest &&
                            docker-compose -f /home/ubuntu/docker-compose.yml up -d
                        "
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '프론트 배포 성공'
        }
        failure {
            echo '프론트 배포 실패'
        }
    }
}