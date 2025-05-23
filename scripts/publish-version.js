import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Octokit } from '@octokit/rest';


function updateNestedField(obj, targetArtifactName, value) {
    const artifacts = obj.artifacts || [];
    for (var artifact of artifacts) {
        if (artifact.name === targetArtifactName && artifact.version < value) {
            artifact.version = value;
            return;
        }
    }
}

export default async (pluginConfig, context) => {
    const { nextRelease, logger, env } = context;
    const newVersion = nextRelease.version;
    const { GH_TOKEN, REPO_OWNER, REPO_NAME, TARGET_ARTIFACT_NAME, GIT_COMMITTER_NAME, GIT_COMMITTER_EMAIL } = env;

    const umbrellaRepoOwner = REPO_OWNER || "Local-Connectivity-Lab";
    const umbrellaRepoName = REPO_NAME || "ccn-coverage-docker";
    const manifestPath = "input-manifest.yml";
    const targetArtifactName = TARGET_ARTIFACT_NAME || "ccn-coverage-vis";
    const baseBranch = 'main';
    const gitUserName = GIT_COMMITTER_NAME || 'scn-git';
    const gitUserEmail = GIT_COMMITTER_EMAIL || 'github@seattlecommunitynetwork.org';

    if (!GH_TOKEN) {
        logger.error(`GitHub token not found in environment variable.`);
        throw new Error(`Missing GitHub token.`);
    }

    const octokit = new Octokit({ auth: GH_TOKEN });
    const umbrellaRepoUrl = `https://github.com/${umbrellaRepoOwner}/${umbrellaRepoName}.git`;
    const localRepoPath = path.resolve(`./tmp-umbrella-repo-${Date.now()}`); // Temporary local path for clone

    const newBranchName = `chore/update-manifest-${newVersion}-${Date.now().toString().slice(-5)}`; // Ensure unique branch name
    const commitMessage = `chore(deps): Update manifest ${manifestPath} to version ${newVersion}`;
    const prTitle = `Update ${manifestPath} to version ${newVersion}`;
    const prBody = `This PR updates the version in \`${manifestPath}\` to \`${newVersion}\` triggered by a new release.`;

    try {
        logger.log(`Starting update process for ${umbrellaRepoOwner}/${umbrellaRepoName}`);
        logger.log(`Cloning ${umbrellaRepoUrl} to ${localRepoPath}`);

        // // --- 1. Clone the umbrella repository ---
        const authenticatedUrl = `https://x-access-token:${GH_TOKEN}@github.com/${umbrellaRepoOwner}/${umbrellaRepoName}.git`;
        execSync(`git clone --depth 1 --branch ${baseBranch} ${authenticatedUrl} ${localRepoPath}`, { stdio: 'inherit' });

        // // --- 2. Configure Git User ---
        execSync(`git -C ${localRepoPath} config user.name "${gitUserName}"`, { stdio: 'inherit' });
        execSync(`git -C ${localRepoPath} config user.email "${gitUserEmail}"`, { stdio: 'inherit' });

        // // --- 3. Create and checkout a new branch ---
        logger.log(`Creating new branch: ${newBranchName}`);
        execSync(`git -C ${localRepoPath} checkout -b ${newBranchName}`, { stdio: 'inherit' });

        // // --- 4. Read, modify, and write the manifest file ---
        const fullManifestPath = path.join(localRepoPath, manifestPath);
        logger.log(`Reading manifest file: ${fullManifestPath}`);
        if (!fs.existsSync(fullManifestPath)) {
            throw new Error(`Manifest file not found at ${fullManifestPath}`);
        }
        const manifestContent = fs.readFileSync(fullManifestPath, 'utf8');
        const manifestData = yaml.load(manifestContent);
        updateNestedField(manifestData, targetArtifactName, newVersion);

        logger.log(`Updated '${targetArtifactName}' to '${newVersion}' in manifest data.`);

        const newManifestContent = yaml.dump(manifestData);
        fs.writeFileSync(fullManifestPath, newManifestContent, 'utf8');
        logger.log(`Successfully wrote updated manifest to ${fullManifestPath}`);

        // // --- 5. Commit and push the changes to the new branch ---
        logger.log(`Committing changes to branch ${newBranchName}`);
        execSync(`git -C ${localRepoPath} add ${manifestPath}`, { stdio: 'inherit' });
        execSync(`git -C ${localRepoPath} commit -m "${commitMessage}"`, { stdio: 'inherit' });

        logger.log(`Pushing branch ${newBranchName} to remote`);
        execSync(`git -C ${localRepoPath} push -u origin ${newBranchName}`, { stdio: 'inherit' });

        // // --- 6. Create a Pull Request ---
        logger.log(`Creating Pull Request: ${prTitle}`);
        const { data: pr } = await octokit.rest.pulls.create({
            owner: umbrellaRepoOwner,
            repo: umbrellaRepoName,
            title: prTitle,
            head: newBranchName,
            base: baseBranch,
            body: prBody,
            maintainer_can_modify: true,
        });
        logger.log(`Pull Request created: ${pr.html_url}`);

        // --- 8. Merge the Pull Request ---
        logger.log(`Attempting to merge Pull Request #${pr.number}`);
        try {
            await octokit.rest.pulls.merge({
                owner: umbrellaRepoOwner,
                repo: umbrellaRepoName,
                pull_number: pr.number,
                commit_title: `${commitMessage} (PR #${pr.number})`,
                merge_method: 'squash',
            });
            logger.log(`Pull Request #${pr.number} merged successfully.`);
        } catch (mergeError) {
            logger.error(`Failed to merge PR #${pr.number}: ${mergeError.message}`);
            logger.error(`Details: ${JSON.stringify(mergeError.response?.data, null, 2)}`);
            logger.warn(`The PR ${pr.html_url} was created but could not be automatically merged. Manual intervention might be required.`);
            throw mergeError;
        }

    } catch (error) {
        logger.error(`An error occurred: ${error.message}`);
        if (error.stderr) {
          logger.error(`Stderr: ${error.stderr.toString()}`);
        }
        if (error.stdout) {
          logger.error(`Stdout: ${error.stdout.toString()}`);
        }
        throw error; // Re-throw to fail the semantic-release step
    } finally {
        // --- 9. Clean up the temporary local clone ---
        if (fs.existsSync(localRepoPath)) {
            logger.log(`Cleaning up temporary directory: ${localRepoPath}`);
            try {
                fs.rmSync(localRepoPath, { recursive: true, force: true });
                logger.log('Temporary directory cleaned up.');
            } catch (cleanupError) {
                logger.warn(`Failed to clean up temporary directory ${localRepoPath}: ${cleanupError.message}`);
            }
        }
    }
};