
Morhpheus Node Setup



Windows OS Systems

Prerequisites

Node.js for Windows
    Follow the instructions listed here for Node.js setup:
        • https://phoenixnap.com/kb/install-node-js-npm-on-windows

Yarn for Windows 
    Follow the instructions listed here for Yarn Package Manager setup:
          •	https://phoenixnap.com/kb/yarn-windows

1. Create Project Directory
Open a Windows command prompt and create a project folder and put your command line at that directory
  
I.e. Presume the starting directory is: C:\projects

		mkdir c:\projects

		cd /d c:\projects
   
2. Morpheus client Workspace Setup
    From a command line at the project directory (created in #1), type:

          git clone https://github.com/MorpheusAIs/Lite-Client.git

3. Project Environment Setup
    Set up the modules and components using the Yarn Package Manager

    Navigate to the command line of the Morpheus client local repository, then type the following command:
   
        yarn

    This will set up all node modules needed.

4. Build the Morpheus Client App
    From a command line at the root directory of the local Morpheus Client repo, build the client executable, type:

   		yarn make


6. Application Runtime and Testing
    Upon successful build, run the Morpheus client app by clicking the following executable or start from the command line:

        <PATH-TO-LOCAL-MORPHEUS-CLIENT-REPO>\Lite-Client-main\out\morpheus-win32-x64.exe



NOTES

•	Additional Run, Test, and Build scripts are located in the package.json configuration file in the root directory of the Morpheus client repo

•	Please visit https://mor.software/ to sign up as a developer to be rewarded for your merged contributions. Submit an MRC to get support for feature and improvement ideas.

•	https://mor.software/ is also the place to build, submit, deploy, and manage all of your Smart Agents.

•	Be sure to complete these steps from an account with administrative access to the host machine

•	The initial start of the application may take extended time to start due to the initial configuration and run of the application



### Windows installer instructions (Doc format)
[Google Doc](https://docs.google.com/document/d/1YjGAlTzglct8aNEqZAUeYD7SAmOETtmv/edit?usp=sharing&ouid=118042204753952761929&rtpof=true&sd=true)

