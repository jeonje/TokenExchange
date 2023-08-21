# 스마트 컨트랙트를 이용한 탈중앙화된 블록체인 토큰 교환 시스템

- 기간: 2018년 8월 1일 → 2019년 5월 31일


## 🧐Overview



- 약 8개월 동안 산학연계 소프트웨어 프로젝트(졸업작품)을 진행하며 Extales 기업과 함께 탈 중앙화된 블록체인 토큰 교환 시스템 개발
- [소스코드](https://github.com/jeonje/TokenExchange)
- [시연영상](https://youtu.be/ioeBkRU5ckE)
- [최종결과물 동영상](https://youtu.be/ioeBkRU5ckE)

## 🙄Goal

1. 블록체인 네트워크에 스마트 컨트랙트를 배포하여 탈 중앙화된 ERC20 토큰 교환 시스템을 개발
2. 개발 비용 제약으로 인해 실제 토큰을 이용할 수 없기 때문에 임의의 토큰을 발행하며 임의의 토큰에 대한 환율정보를 생성하는 데몬을 개발하여 사용
3. 구현 항목
가) 토큰 교환 및 부가적 기능을 가진 스마트컨트랙트 작성 및 블록체인 네트워크에
배포
나) 스마트 컨트랙트와 연동하는 프론트엔드 개발
다) 임의의 토큰 환율을 제공하는 제너레이터 개발
라) Dapp에 필요한 부수적 기능 개발

## 😤stack



1) 프론트엔드 : Vue.js, .html. css, bootstrap, modalUI, web3.js, Metamask, Firebase

2) 스마트컨트랙트 : Solidity 0.5.0

3) 블록체인 네트워크 : Remix IDE, Ropsten Test-net

4) 제너레이터 : Node.js


## 👓Role



<details>
<summary>1.프로젝트 일정 관리 및 팀원 업무 분배(팀장)</summary>
<div markdown="1">

![1](https://user-images.githubusercontent.com/43032391/212154748-08b3b61c-355e-438d-a216-5bdbf9be46db.png)

</div>
</details>


<details>
<summary>2.프로젝트 설계</summary>
<div markdown="1">

**- 프로젝트 구조 설계**

![2](https://user-images.githubusercontent.com/43032391/212154797-b00b731f-d575-4008-bb17-d6db24bfab06.png)


      [1] Vue.js : Web3.js 를 사용하여 스마트 컨트랙트와 연동하는 사용자 인터페이스를 구성 , 싱글 페이지 어플리케이션

      [2] Node.js : 블록체인에 배포된 스마트 컨트랙트에 임의의 토큰 간 환율을 일정 시간 마다 제공 및 Express Framework 사용

      [3] Smart Contract : Solidity 언어로 작성되어 있고 교환 의사 데이터가 내포된

      코드, ERC20 토큰 간 교환, 외환송금 등 일정한 조건이 만족하면 자동으로 기능 이행

      [4] BlockChain Network: Smart Contract가 배포되는 네트워크, Ropsten 테스트넷 사용
      
        
**- Use Case**

  ![3](https://user-images.githubusercontent.com/43032391/212154886-103b8147-0612-48ed-a67e-b48b85535b85.png)

        

**- Sequence Diagram 작성**
**- 환전**

![4](https://user-images.githubusercontent.com/43032391/212154944-658f82fa-52d1-4cd3-880b-0346353f7621.png)


      (1) 프론트엔드에서 환전 메뉴를 누를 시 Ropsten 테스트넷과 연결을 시도 한다.

      (2) Ropsten 테스트넷에 배포된 스마트 컨트랙트는 데몬으로부터 매 3분마다 임의의 환율 정보를 제공 받는다.

      (3) 프론트엔드는 연결된 테스트넷으로 부터 환율 정보를 가져와 표로 보여준다.

      (4) 사용자는 표를 통해 자신이 원하는 환전 정보를 입력하고 확인 하는 과정을 거치게 된다.

      (5) 사용자 지갑 잔액이 입력한 양보다 더 많다면 increaseApprove 함수를 통해 스마트 컨트랙트가 입력한 양만큼 토큰을 사용할 수 있게 허가한다.

      (6) exchange 함수를 통해 토큰을 환율 정보에 따라 교환한다. 환전이 완료되었다면 결과를 나타낸다. 만약 잔액이 입력한 양 보다 적다면 오류를 프론트엔드에 나타낸다.

    
  **- 거래내역**

![5](https://user-images.githubusercontent.com/43032391/212155035-27aa1c5a-937d-4fdb-b175-2caa1ddbfaf0.png)


      (1) 프론트엔드에서 거래내역 메뉴를 누를 시 Ropsten 테스트넷과 연결을 시도 한다.

      (2) 유저 계좌 정보를 입력받는다.

      (3) 이더스캔 api를 사용하여 Ropsten 테스트넷에서 최근 5개의 거래내역을 가져온다.

      (4) 거래내역을 프론트엔드에 표로 나타낸다.
       
        
  **- 잔액조회**

![6](https://user-images.githubusercontent.com/43032391/212155097-7981f4f2-d385-4810-bdc8-8e3d90ae061b.png)


      (1) 프론트엔드에서 거래내역 메뉴를 누를 시 Ropsten 테스트넷과 연결을 시도 한다.

      (2) 유저 계좌 정보를 입력받는다.

      (3) 오픈제플린 솔리디티의 ERC20 ABI 정보를 가지고 있으므로 balancOf 함수를 사용하여 유저가 가지고 있는 ERC20 토큰 정보를 가져온다.

      (4) 유저가 가지고 있는 ERC20 토큰 정보를 표로 나타낸다.

      (5) 관리자의 스마트 컨트랙트 잔액조회 기능과 유사하며 차이점은 유저의 계좌정보를 입력받지 않고 스마트 컨트랙트의 계좌주소를 통해 바로 계좌 주소 잔액을 확인한다.
        
  
  **- 입금/출금**

![7](https://user-images.githubusercontent.com/43032391/212155186-ccda7bdf-862e-4b28-9b83-562519625ebf.png)


      (1) 프론트엔드에서 입금을 누를 시 Ropsten 테스트넷과 연결을 시도 한다.

      (2) 관리자로부터 스마트 컨트랙트로 입금할 정보를 입력받는다.

      (3) 스마트 컨트랙트로 입금할 정보를 확인한다.

      (4) 스마트 컨트랙트의 increaseApprove 함수 를 통해 depositAmount 만큼 스마트 컨트랙트가 토큰을 사용할 수 있음을 허가한다.

      (5) 스마트 컨트랙트의 deposit 함수를 통해 사용자계좌로부터 depositAmount 만큼 스마트 컨트랙트로 입금한다.

      (6) 입금한 결과를 표를 통해 프론트앤드로 나타낸다.

      (7) 입금과 출금의 차이점은 입금 시에는 deposit 함수를 호출하고 출금 시에는 withdraw 함수를 호출한다.

</div>
</details>


        
<details>
<summary>3.블록체인 네트워크에 배포되는 스마트컨트랙트와 연동되는 프론트 앤드(Vue.js) 개발</summary>
<div markdown="1">

 - 메인 화면

    ![8](https://user-images.githubusercontent.com/43032391/212155366-f66cbcc4-8e74-414c-a4cb-aa5c359a68a6.png)


  - 환전 화면

    ![9](https://user-images.githubusercontent.com/43032391/212155418-8f0c96ec-5104-43b7-b848-0692db4a0297.png)


  - 메타마스크(이더리움 지갑)과 스마트컨트랙트 함수 호출

    ![10](https://user-images.githubusercontent.com/43032391/212155471-c3fc41c6-a153-41ca-994f-da4b9070a849.png)


  - 환전 후 화면

    ![11](https://user-images.githubusercontent.com/43032391/212155539-056f801f-f7e8-42b9-a233-fd72e893fdd9.png)


  - Ropsten 테스트넷에 배포된 스마트 컨트랙트와 토큰

  ![12](https://user-images.githubusercontent.com/43032391/212155593-e65effd6-ac41-4f01-9f49-ec5d24bd44dc.png)


</div>
</details>

        
<details>
<summary>4.ERC-20 토큰 사이의 임의의 환율을 생성하는 제너레이터(Node.js) 개발</summary>
<div markdown="1">

![13](https://user-images.githubusercontent.com/43032391/212155640-c5beaff4-9019-4376-88e6-ff079a6fafb4.png)

</div>
</details>

<details>
<summary>5.개발 테스트</summary>
<div markdown="1">

![14](https://user-images.githubusercontent.com/43032391/212155704-d5ede84a-8730-4f98-bf5c-e5cf9ef627a3.png)


![15](https://user-images.githubusercontent.com/43032391/212155748-1c184500-ac44-45fa-8d9a-338330860422.png)

    
</div>
</details>    

    


## ⭐takeaway


약 8개월 동안 팀장으로서 프로젝트를 진행하면서 가장 많이 느낀 것은 책임감과 팀워크입니다. 혼자서 프로젝트를 진행했으면 많은 어려움에 프로젝트 완료를 못했을 것 같습니다.

실무 개발자분로부터 처음 멘토링을 받았는데 우물 안의 개구리임을 절실히 느꼈습니다. 개발자로써 성장하고 싶고 잘하고 싶다는 생각이 많이 들었습니다. 이 프로젝트를 통해 새로운 내용을 배우고 적용하는 것에 대한 두려움을 많이 없앨 수 있었습니다.

**성과**

- 19년도 하반기 한국정보처리학회 추계학술발표대회 논문 게재
- 19년 광운대 컴퓨터공학과 졸업작품 전시회 장려상
