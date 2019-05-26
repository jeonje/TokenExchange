import Web3 from 'web3';

let getWeb3 = new Promise((resolve, reject) => {
    let web3js = window.web3;

    if (typeof web3js !== 'undefined') {

      let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/829a14a4e6a5475797232b2333cface6')); // connect ropsten

      resolve({
        injectedWeb3: web3.eth.net.isListening(),
        web3() {
          return web3;
        }
      });
    } else {
      reject(new Error('메타마스크와 연결을 할 수 없습니다'))
    }
  }).then(result => {

    return new Promise((resolve, reject) => {
      result.web3().eth.net.getNetworkType((error, networkId) => { //get getwork

        if (error) {
          reject(new Error('네트워크 아이디를 가져올 수 없습니다'))
        } else {

          result = Object.assign({}, result, {
            networkId
          });
          resolve(result);
        }
      })
    }) //end of Promise
  }) // end of then
  .then(result => {
    return new Promise((resolve, reject) => {
      web3.eth.getAccounts((error, coinbase) => { //get accounts from meta mask
        if (error) {
          reject(new Error('계좌를 가져 올 수 없습니다'));
        } else {
          result = Object.assign({}, result, {
            coinbase
          });
          resolve(result);
        }
      });
    }); //end of Promise
  }) // end of then
  .catch((error) => {
    console.log('catch :', error);
  })

export default getWeb3;
