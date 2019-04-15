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
      sh 'groups'
      sh 'docker build -t tealeel-frontend -f Dockerfile --no-cache .'
      dockerImage = docker.build("keezee/tealeel:${BUILD_NUMBER}")
    }
    stage('Push Docker image'){
      docker.withRegistry( 'https://registry.hub.docker.com', 'docker_registry_server') {
        dockerImage.push()
      }
    }
    stage('Clean Docker Images'){
      // sh 'docker rmi tealeel-frontend'
      sh 'yes | docker system prune -a'
    }
    stage('Deploy'){
      sshagent(credentials : ['tealeel-frontend-ssh-credentials']) {
      sh '''
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          sudo rm -rf arting-it &&
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          git clone git@github.com:keeganthomp/arting-it.git
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          cp -r letsencrypt arting-it
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          docker build -t tealeel-frontend-image -f ./arting-it/Dockerfile --no-cache .
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          docker stop tealeel-frontent-container
          ssh -o StrictHostKeyChecking=no root@${FRONTEND_SERVER_IP} -C\
          docker run 
        '''
        sh "echo 'new docker image(s) running'"
      }
    }
  }
  catch (err) {
    throw err
  }
}