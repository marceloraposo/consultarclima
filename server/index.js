const port = 8080;
const ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
const appid = 'dcc4b4fa314f3b593cef80cfe637b113'; //chave para acessar serviço externo

exports = module.exports = {
	port: port,
	ip: ip,
	appid: appid
}