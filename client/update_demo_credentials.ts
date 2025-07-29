/**
 * Script to update the demo credentials in the Login.tsx file
 */

import * as fs from 'fs';
import * as path from 'path';

function updateDemoCredentials() {
    const loginFilePath = path.join(__dirname, 'pages', 'Login.tsx');
    
    try {
        // Read the current Login.tsx file
        let content = fs.readFileSync(loginFilePath, 'utf8');
        
        // Update the demo credentials section
        const oldCredentials = `                <p>
                  <strong>Email:</strong> pranav1233@gmail.com
                </p>
                <p>
                  <strong>Password:</strong> demo123
                </p>`;
        
        const newCredentials = `                <p>
                  <strong>Email:</strong> pranav1233@gmail.com
                </p>
                <p>
                  <strong>Password:</strong> .tie5Roanl
                </p>`;
        
        // Replace the old credentials with new ones
        const updatedContent = content.replace(oldCredentials, newCredentials);
        
        // Write the updated content back to the file
        fs.writeFileSync(loginFilePath, updatedContent, 'utf8');
        
        console.log('✅ Demo credentials updated in Login.tsx');
        console.log('Email: pranav1233@gmail.com');
        console.log('Password: .tie5Roanl');
        
    } catch (error) {
        console.error('❌ Error updating demo credentials:', error);
    }
}

// Run the update
updateDemoCredentials(); 