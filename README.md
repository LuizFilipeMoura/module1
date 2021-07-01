PASSO A PASSO PARA INSTALAÇÃO

BUILDAR BACKEND

Dentro da pasta raiz do projeto, executar os seguintes comandos

ABRIR PASTA DO BACK-END
cd backEnd

BUILDAR CONTAINER NODE
docker build -f node.dockerfile -t node .

BUILDAR CONTAINER PGSQL
docker build -f pgsql.dockerfile -t pgtest .

BUILDAR CONTAINER WEBSOCKET
docker build -f ws.dockerfile -t ws .

Após a construção das imagens do Back-End, deve-se construir as imagens para o DNS e o front-end da aplicação

ABRIR PASTA DO FRONT-END
cd forex-nextjs

BUILDAR NEXT
docker build -f next.dockerfile -t web .

CONFIGURAR DNS
docker run -d --hostname dns.mageddo --restart=unless-stopped -p 5380:5380  -v /var/run/docker.sock:/var/run/docker.sock -v /etc/resolv.conf:/etc/resolv.conf  defreitas/dns-proxy-server

DOCKER COMPOSE
docker-compose up


CONFIGURAÇÃO DO PGMYADMIN 4 e 3
=======

Acesse a página aberta pelo PgMyAdmin 4 e 3 (por padrão é o endereço http://127.0.0.1/), as credenciais são 
email: user@domain.com 
senha: SuperSecret

Clique em Login.

Clique com o botão direito em Servers, selecione a opção Create no submenu aberto, clique em Server, abrirá uma nova janela.
Defina o nome PgTest, depois, na aba Connections,  e adicione os seguintes valores aos campos, 

Host name/address: pgtest; 
Username: docker
Password: docker 
