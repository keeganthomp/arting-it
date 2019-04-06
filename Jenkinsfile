node {
  environment {
    registry = "keezee/tealeel"
    registryCredential = "docker_registry_server"
    dockerImage = ""
  }
  try {
    stage('Checkout') {
      checkout scm
    }
    stage('Environment') {
      sh 'git --version'
      echo "Branch: ${env.BRANCH_NAME}"
      sh 'docker -v'
      sh 'printenv'
      echo "BUILDDDD: ${BUILD_NUMBER}"
    }
    stage('Build Docker test'){
      sh 'groups'
      sh 'docker build -t react-test -f Dockerfile --no-cache .'
      dockerImage = docker.build registry + ":${BUILD_NUMBER}"
    }
    stage('Push Docker image'){
      docker.withRegistry( '', registryCredential ) {
        dockerImage.push()
      }
    }
    stage('Clean Docker test'){
      sh 'docker rmi react-test'
    }
    stage('Deploy'){
      if(env.BRANCH_NAME == 'master'){
        sh 'docker build -t react-app --no-cache .'
        sh 'docker tag react-app localhost:5000/react-app'
        sh 'docker push localhost:5000/react-app'
        sh 'docker rmi -f react-app localhost:5000/react-app'
      }
    }
  }
  catch (err) {
    throw err
  }
}