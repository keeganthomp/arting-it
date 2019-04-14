node {
  environment {
    REGISTRY = "keezee/tealeel"
    REGISTRY_CREDENTIALS = "docker_registry_server"
    dockerImage = ""
  }
  try {
    stage('Checkout') {
      checkout scm
    }
    stage('Check Environment') {
      sh 'git --version'
      echo "Branch: ${env.BRANCH_NAME}"
      sh 'docker -v'
      sh 'printenv'
    }
    stage('Build Docker Image'){
      sh 'docker build -t tealeel-frontend -f Dockerfile --no-cache .'
      dockerImage = docker.build("keezee/tealeel:${BUILD_NUMBER}")
    }
    stage('Push Docker image'){
      docker.withRegistry( 'https://registry.hub.docker.com', 'docker_registry_server') {
        dockerImage.push()
      }
    }
    stage('Clean Docker Images'){
      sh 'docker rmi tealeel-frontend'
      sh 'yes | docker system prune -a'
    }
    stage('Deploy'){
      sshagent(credentials : ['tealeel-frontend-ssh-credentials']) {
      sh 'scp Dockerfile root@${FRONTEND_SERVER_IP}:~'
      sh '''
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          docker build . -t tealeel-frontend-image
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          docker stop tealeel-fronted-app
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          docker run --name tealeel-fronted-app -p 80:80 -p 443:443 -d tealeel-frontend-image
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          docker rm -f tealeel-fronted-image
        '''
        sh "echo 'new docker image(s) running'"
      }
    }
  }
  catch (err) {
    throw err
  }
}