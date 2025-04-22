import { execSync } from 'child_process';

export default async ({ nextRelease }) => {
  const version = nextRelease.version;
  const imageName = 'ghcr.io/Local-Connectivity-Lab/ccn-coverage-vis';

  console.log(`Building Docker image ${imageName}:${version}`);

  execSync(`docker build -t ${imageName}:${version} .`, { stdio: 'inherit' });
  execSync(`docker tag ${imageName}:${version} ${imageName}:latest`, { stdio: 'inherit' });
  execSync(`docker push ${imageName}:${version}`, { stdio: 'inherit' });
  execSync(`docker push ${imageName}:latest`, { stdio: 'inherit' });
};
