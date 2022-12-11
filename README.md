# Elpaso :bar_chart:

Paying with a credit card usually comes with an online banking option, which can handle the finances management for the user. However, cash payments are trickier.  
Elpaso is a containerized microservices based project destined to offer a solution to cash payments management by scanning receipts in Romanian and generating financial analysis reports and product classification.

## Features

- Scan a receipt in Romanian and generate an editable financial report thanks to data analysis and OCR processing
- Keep track of everyday's spendings, no matter the payment method
- Get a classification of products based on a romanian database built specifically for Elpaso
- Export the results as CSV, delete or add other entries 
- Fast authentication with OAuth2.0


## Tech

:computer: Web application 

- **ReactJS** - Javascript client side library
- **Django** - Django backend framework
- **PostgreSQL** - Relational database management system
- **PgAdmin** - tool used for interracting with the database
- **Firebase** - UI authentication library
- **Google Cloud storage** - OAuth 2.0 and storage platform
- [**OCRly**](https://rapidapi.com/nadkabbani/api/ocrly-image-to-text) - OCR API 
- **Certbot** - Tool used for HTTPS Let’s Encrypt certificates 

:rocket: Deployment

- **Docker** - PaS for service containerization 
- **Docker Swarm** - container orchestration tool
- **Docker machine** - Virtual machines management tool 
- **Nginx** - reverse proxy
- **Gluster FS** - Distributed File System
- **Sematext** - monitoring agent
- **AWS/Digital Ocean** - IaaS platforms for VMs


# DEMO - check it out [here](https://www.youtube.com/watch?v=cYBhlQmaEG0)

<img src="https://iili.io/HnV0kdX.png" alt="drawing" width="200"/>   <img src="https://iili.io/HnVXSFR.png" alt="drawing" width="200"/>

<img src="https://iili.io/HnVjTeS.png" alt="drawing" width="200"/>   <img src="https://iili.io/HnVjPBs.png" alt="drawing" width="200"/>

<img src="https://iili.io/HnVh8xe.png" alt="drawing" width="200"/>  <img src="https://i.imgur.com/YwWDIBY.png" alt="drawing" width="200"/>  

<img src="https://i.imgur.com/EYHqIUl.png" alt="drawing" width="200"/>  <img src="https://i.imgur.com/OB3rIxG.png" alt="drawing" width="200"/>  

## Configure and run the local Dockerized version yourself
  
 Steps: 
  1. Clone the repository on the `elpaso-compose` branch
  2. Complete the credentials files (.env.*, firebase-config and Google_Cloud_credentials) by generating your own credentials.
      - e.g. in .env.local, replace **REACT_APP_FIREBASE_API_KEY**=xxxx    
  3. Install docker-compose and execute `docker-compose up` to start the containers and the services running inside them. 
  4. Connect on [http://localhost:3000](http://localhost:3000/) and start testing!
  
 ## Deploy the stack yourself 
 
 > At the moment the Orchestrated version is not deployed, due to costs generated by maintaining the VMs.

 1. Clone the repository on the `elpaso-swarm` branch
 2. Configure the `docker-compose-stack.yml` file with the desired number of replicas, based on the resources you have available.
 3. Configure several virtual machines which will be the workers and manager/s for the Swarm. This project was built with 1 manager and 2 worker nodes. Refer to [this](https://docs.docker.com/engine/swarm/swarm-mode/) for more information on how to do so.
 4. Install Docker on the virtual machines and [Configure the Linux Firewall for Docker Swarm](https://www.digitalocean.com/community/tutorials/how-to-configure-the-linux-firewall-for-docker-swarm-on-ubuntu-16-04)
 5. Complete the credentials files (.env.*, firebase-config and Google_Cloud_credentials) by generating your own credentials.
    e.g. in .env.local, replace **REACT_APP_FIREBASE_API_KEY**=xxxx 
 6. Use a file transfer protocol such as **SCP** to move the secret keys completed at step 5. and the reverse_proxy/ folder securely to each of the VMs.
 6. Associate a domain to your manager's IP using, for example, the No-IP domain and host service provider. The code is currently configured with the elpaso.zapto.org domain, therefore if possible, choose this one.
 7. Generate Let's Encrypt HTTPS certificates using Certbot. Refer to [this](https://finnian.io/blog/ssl-with-docker-swarm-lets-encrypt-and-nginx/) for more information.
 8. Execute `docker stack deploy -c docker-compose-stack.yml elpaso` to start the stack and access it on the port 3000 of the domain you chose at step 6. 

 ! In this project, Sematext was used as a monitoring agent. The configuration for it can be skipped if you do not wish to test the monitoring feature. 


    
  # Credentials completion instructions 
  Files: 

   - .env.dev: 
     - DEBUG: should never be 1 in production 
     - SQL_*: all the values necessary for accessing the PostgreSQL database. Check [here](https://www.digitalocean.com/community/tutorials/how-to-use-postgresql-with-your-django-application-on-ubuntu-20-04) for more information. 
     - GOOGLE_OAUTH2_CLIENT_ID: Create a new Google Cloud Project. Go to the APIs and Services section of products and add a new Web Client ID and API key. The Client ID that was generated will be added here. 
      - When creating a new Web Client, allow https://elpaso.zapto.org as a Javascript origin if you are deploying the stack, and http://localhost:8000 
     and http://localhost:3000 for running locally with compose. 
      - Similarly, allow https://elpaso.zapto.org and https://elpaso.zapto.org/login or the localhost versions for the redirect URIs.
     - RAPID_API_*: Create a Sematext account and subscribe to the [OCRLY](https://rapidapi.com/nadkabbani/api/ocrly-image-to-text) API. All the information will be found in the Endpoints tab.
     - BUCKET_NAME: Using the same GCP Project created above, go to Cloud Storage -> Buckets and create a new public bucket. Add the name here. 
      ! The receipt images are stored only for <1s, enough to send a link to the external API that will do the OCR processing. 

   - Google_Cloud_credentials: Go to IAM and Admin section in the Google Cloud Console and select the Cloud service accound. Go to Keys and generate a new one. A json file will be automatically downloaded. Rename it to `Google_Cloud_credentials:`. For more information, read [here](https://help.brightdata.com/hc/en-us/articles/6254819504145-How-to-find-your-Google-Cloud-Private-Key).

   - .env.database.dev: These are values used for accessing the local PostgreSQL database via PgAdmin. The values for the USER, PASSWORD AND DB will correspond with the ones set above.
    For example:
      - PGDATA=/var/lib/postgresql/data
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=elpaso
    
   - .env.local: Create a Web Firebase project with localhost/elpaso.zapto.org Authorised domains and generate the SDKs. These will provide all the information for the required fields, apart from  REACT_APP_CLIENT_ID. This field corresponds to the GOOGLE_OAUTH2_CLIENT_ID set in .env.dev
   
   - firebase-config.json:  Similar to the Google Cloud Storage generation, go to the firebase console to Settings > Service Accounts, generate a new private key and it will be automatically downloaded. Rename it to `firebase-config.json`. For more information, read [here](https://firebase.google.com/docs/admin/setup).
  
   - .env.sematext: adding Sematext monitoring is not mandatory, especially because it is not a free service. However, if you do wish to add it refer to [this](https://sematext.com/docs/agents/sematext-agent/containers/installation/) tutorial. Otherwise, remove the sematext container from the docker-compose-stack.
      
      
    
That's all! Enjoy safely monitoring your expenses! :sparkles:	


  
