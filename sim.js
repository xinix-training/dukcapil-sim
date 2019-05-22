const http = require('http');
const Bundle = require('bono');

const PORT = process.env.PORT || 3000;

let users = [
  {
    user_id: 'banksulteng',
    password: 'banksulteng#test',
  },
];

let ipAddresses = [
  '127.0.0.1',
];

let contents = [
  {
    NIK: '0001',
    EKTP_STATUS: 'BELUM REKAM',
    NAMA_LGKP: 'JACK DANIEL',
    AGAMA: 'ISLAM',
    TMPT_LHR: 'JAKARTA',
    STATUS_KAWIN: 'BELUM KAWIN',
    TGL_KWN: null,
    JENIS_KLMIN: 'LAKI-LAKI',
    NO_KK: '001',
    TGL_LHR: '1995-03-13',
  },
  {
    NIK: '0002',
    EKTP_STATUS: 'SUDAH REKAM',
    NAMA_LGKP: 'SITI JUBAEDAH',
    AGAMA: 'KRISTEN',
    TMPT_LHR: 'PALU',
    STATUS_KAWIN: 'KAWIN',
    TGL_KWN: '2018-01-01',
    JENIS_KLMIN: 'PEREMPUAN',
    NO_KK: '002',
    TGL_LHR: '1995-03-13',
  },
];

function isAllowed (ipAddress) {
  if (!ipAddresses.find(ip => ip === ipAddress)) {
    throw new Error('IP Address Tidak Sesuai');
  }
}

function isLoggedin (userId, password) {
  if (!users.find(user => user.user_id === userId && user.password === password)) {
    throw new Error('Login Gagal');
  }
}

function getContentByNik (nik) {
  let result = contents.filter(row => row.NIK === nik);
  if (!result.length) {
    throw new Error('Data Tidak Ditemukan');
  }
}

const app = new Bundle();

app.use(require('bono/middlewares/json')());

app.post('/CALL_NIK', async ctx => {
  let { user_id: userId, password, NIK: nik, ip_address: ipAddress } = await ctx.parse();

  let content = [];

  try {
    isAllowed(ipAddress);
    isLoggedin(userId, password);
    content = getContentByNik(nik);
  } catch (err) {
    content.push({ RESPON: err.message });
  }

  return {
    content,
    lastPage: true,
    numberOfElements: 1,
    sort: null,
    totalElements: 1,
    firstPage: true,
    number: 0,
    size: 1,
  };
});

const server = http.createServer(app.callback());
server.listen(PORT, () => console.log(`Server listening at ${PORT}`));
