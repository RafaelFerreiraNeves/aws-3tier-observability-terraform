##  CHECAR SE A APLICAÇÃO ESTÁ CONECTANDO COM O BANCO

### Validar a variável de ambiente do banco de dados dentro do contêiner

```bash
docker exec -it node-app printenv | grep DB_HOST
```

### Visualizando logs do container

```bash
docker logs node-app
```

### Verificando resolução de DNS do banco de dados

```bash
nslookup app-db.cclwyemq4f8s.us-east-1.rds.amazonaws.com
```

### Visualizando conteúdo de arquivo de debug

```bash
cat /home/ec2-user/db_debug.txt
```

### Verificando resolução de hostname via sistema

```bash
getent hosts app-db.cclwyemq4f8s.us-east-1.rds.amazonaws.com
```

---

##  VALIDAR SE O ALB ESTÁ RODANDO

### Teste completo com verbose

```bash
curl -v http://app-alb-2124097346.us-east-1.elb.amazonaws.com
```

### Teste básico do ALB (HTTP status detalhado)

```bash
curl -I http://app-alb-2124097346.us-east-1.elb.amazonaws.com
```

### Testar resolução DNS do ALB

```bash
nslookup app-alb-2124097346.us-east-1.elb.amazonaws.com
```

### Instalar netcat (caso não esteja instalado)

```bash
sudo yum install -y nc
```

### Testar conexão TCP na porta 80

```bash
nc -zv app-alb-2124097346.us-east-1.elb.amazonaws.com 80
```

### Testar múltiplas requisições (ver load balancing)

```bash
for i in {1..10}; do curl -s http://app-alb-2124097346.us-east-1.elb.amazonaws.com/; echo; done
```
