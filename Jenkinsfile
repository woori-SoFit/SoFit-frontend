pipeline {
    agent any

    options {
        disableConcurrentBuilds()
    }
    
    triggers {
        githubPush()
    }

    environment {
        REGISTRY = '172.21.33.225:5000'
        FRONTEND_SERVER = '172.21.33.214'
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
                        ${tool 'sonar-scanner'}/bin/sonar-scanner \
                            -Dsonar.projectKey=sofit-frontend \
                            -Dsonar.sources=user-front/src,admin-front/src \
                            -Dsonar.exclusions=**/node_modules/**,**/dist/**
                    """
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([
                    string(credentialsId: 'VITE_USER_API_URL', variable: 'USER_API_URL'),
                    string(credentialsId: 'VITE_ADMIN_API_URL', variable: 'ADMIN_API_URL')
                ]) {
                    sh '''
                        echo "VITE_API_BASE_URL=${USER_API_URL}" > user-front/.env
                        echo "VITE_API_BASE_URL=${ADMIN_API_URL}" > admin-front/.env

                        docker build -t $REGISTRY/sofit-user-front:latest -f user-front/Dockerfile .
                        docker push $REGISTRY/sofit-user-front:latest

                        docker build -t $REGISTRY/sofit-admin-front:latest -f admin-front/Dockerfile .
                        docker push $REGISTRY/sofit-admin-front:latest
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sshagent(['sofit-app-ssh']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@$FRONTEND_SERVER "
                            docker pull $REGISTRY/sofit-user-front:latest &&
                            docker pull $REGISTRY/sofit-admin-front:latest &&
                            docker-compose -f /home/ubuntu/docker-compose.yml down &&
                            docker-compose -f /home/ubuntu/docker-compose.yml up -d
                        "
                    '''
                }
            }
        }
    }

    post {
        always { sh 'docker image prune -a -f --filter "until=72h"' }
        success { echo '프론트 배포 성공' }
        failure { echo '프론트 배포 실패' }
    }
}
