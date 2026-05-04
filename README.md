#  AWS 3-Tier Application with Observability (Terraform + Docker + CI/CD)

##  Overview

Este projeto demonstra a construção de uma arquitetura **3-tier na AWS**, totalmente provisionada com **Terraform**, com deploy automatizado via **GitHub Actions** e aplicação containerizada com **Docker**.

Inclui também um pipeline de **observabilidade de logs**, simulando um cenário real de produção.

---

##  Arquitetura

A aplicação segue o padrão **3 camadas**:

* **Frontend / Entry:** Application Load Balancer (ALB)
* **Backend:** EC2 rodando aplicação Node.js (Docker)
* **Database:** Amazon RDS
* **Observabilidade:**

  * Logs do ALB enviados para S3
  * Processamento via Lambda
  * Monitoramento no CloudWatch

---

##  Tecnologias utilizadas

* AWS (EC2, ALB, S3, RDS, Lambda, CloudWatch)
* Terraform (Infraestrutura como Código)
* Docker
* Node.js
* GitHub Actions (CI/CD)

---

##  Estrutura do projeto

```bash
.
├── app/                 # Aplicação Node.js + Dockerfile
│   ├── app.js
│   ├── package.json
│   └── Dockerfile
│
├── terraform/          # Infraestrutura AWS
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
│
└── .github/workflows/  # Pipeline CI/CD
```

---

##  Pipeline CI/CD

O deploy é automatizado via GitHub Actions:

### Etapas:

1. Build da imagem Docker
2. Push para Docker Hub
3. Provisionamento com Terraform
4. Deploy automático da infraestrutura

---

##  Build e execução local

```bash
cd app

docker build -t node-app .
docker run -p 3000:3000 node-app
```

---

##  Deploy na AWS

```bash
terraform init
terraform plan
terraform apply
```

---

##  Observabilidade

* Logs do ALB enviados para **S3**
* Processados via **Lambda**
* Visualização no **CloudWatch Logs**

---

##  Variáveis necessárias

No GitHub Secrets:

* `DOCKER_USERNAME`
* `DOCKER_PASSWORD`
* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`

---

##  Demonstração

(Adicione aqui prints do ALB, aplicação rodando e CloudWatch)

---

##  Aprendizados

* Provisionamento completo com Terraform
* Integração CI/CD com GitHub Actions
* Deploy de aplicação containerizada na AWS
* Pipeline de observabilidade com logs reais

---

##  Próximos passos (melhorias)

* Migrar EC2 → ECS ou EKS
* Adicionar HTTPS com ACM
* Implementar Auto Scaling
* Monitoramento com Prometheus + Grafana
* Blue/Green Deploy

---

##  Autor

Rafael Ferreira Neves

---

##  Licença

Este projeto foi desenvolvido com foco em portfólio e aprendizado prático, simulando desafios reais encontrados em ambientes de produção.
