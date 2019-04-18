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
    stage('Clean Docker Images'){
      sh 'yes | docker system prune -a'
    }
    stage('Build & Deploy'){
      sshagent(credentials : ['tealeel-frontend-ssh-credentials']) {
      sh '''
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          sudo rm -rf arting-it &&
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          git clone https://github.com/keeganthomp/arting-it.git
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          cp -r letsencrypt arting-it
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          cp -r .env arting-it
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          docker rmi -f tealeel-frontend-image
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          docker build -t tealeel-frontend-image -f ./arting-it/Dockerfile --no-cache .
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          docker rm --force tealeel-frontend-container
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          docker run --name tealeel-frontend-container -p 80:80 -p 443:443 -d tealeel-frontend-image --env-file .env
        '''
        sh "echo 'new docker image(s) running'"
      }
    }
  }
  catch (err) {
    throw err
  }
}