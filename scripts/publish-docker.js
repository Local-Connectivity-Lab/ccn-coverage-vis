import { execSync } from 'child_process';

export default async (pluginConfig, context) => {
    const { nextRelease } = context;
    const version = nextRelease.version;

    const imageName = 'ghcr.io/Local-Connectivity-Lab/ccn-coverage-vis';

    console.log(`Building Docker image: ${imageName}:${version}`);

    execSync('make build', { stdio: 'inherit' });
    execSync(`docker tag ${imageName}:${version} ${imageName}:latest`, { stdio: 'inherit' });
    execSync(`docker push ${imageName}:${version}`, { stdio: 'inherit' });
    execSync(`docker push ${imageName}:latest`, { stdio: 'inherit' });
};