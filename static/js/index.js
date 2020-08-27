window.onload = function() {

    var dispatcher = new cf.EventDispatcher();
    dispatcher.addEventListener(cf.FlowEvents.USER_INPUT_UPDATE, function(event) {
    var userInput = event.detail.text
    // console.log(userInput)
    // console.log(event)
    if (userInput === "quit"){
      var formDataSerialized = conversationalForm.getFormData(true);
      formDataSerialized['cfc-bank-settings'].length = 0;
      formDataSerialized['cfc-services'].length = 0;
    }
  },
  false
);


      var conversationalForm = new window.cf.ConversationalForm.startTheConversation({
      formEl: document.getElementById("form"),
      context: document.getElementById("cf-context"),
      robotImage: ("/static/img/kwesi2.png"),
      userImage: ("/static/img/user1.png"),
      eventDispatcher: dispatcher,
      submitCallback: function() {
        var formDataSerialized = conversationalForm.getFormData(true);
       console.log(formDataSerialized);
        var code = 1234;

        // function authenticate(AccountNumber) {
        //   var data
        //   $.ajax({ 'async': false, data: {AccountNumber: AccountNumber}, type: 'POST', url: '/authenticate', 
        //   success: function(res) {
        //     if (res.user) {
        //       data = res
        //       console.log(data)
        //     }
        //     else if (res.error) {
        //       data = res
        //       console.log(data)
        //     }
        //   }
        // })
        // return data
        // }
        
        function authenticate(AccountNumber) {
          var data
 
              $.ajax({
                 'async': false,
                 data: {AccountNumber: AccountNumber},
                 type: 'POST',
                 url: '/authenticate',
                 success: function (res) {
                 if (res.user) {
                          data = res
                         //  console.log(res)
                       }
 
                 else if (res.error) {
                            data = res
                           //  console.log(res)
                       }
                 }
                 })
 
             return data
                 }
 

       
        if (formDataSerialized['cfc-services'] == "bank-settings" ){
          if (formDataSerialized['cfc-bank-settings'] == 'block-card') {
            var AccountNumber = formDataSerialized['block-card-account']
            var card = formDataSerialized['block-card-card']
            Auth = authenticate(AccountNumber)
            console.log(Auth)
            if (Auth.user){
              // console.log(Auth.data[0].CardBlock)
              // console.log(typeof Auth.data[0].CardBlock)
              // console.log('trial')
              if (Auth.data[0].CardNumber == card){
                if (Auth.data[0].CardBlock == true){
                  var otp = prompt('Please enter the one time password sent to your device')
                  if (otp == code){
                    var message = `Card ${card} has already been blocked`
                  }
                  else {
                    var message = 'Could not authenticate account'
                  }
                }
                else {
                  var otp = prompt('Please enter the one time password sent to your device')
                  if (otp == code){
                    var data
                    $.ajax({
                      'async': false,
                      data: {AccountNumber: AccountNumber},
                      type: 'POST',
                      url: '/cardblock',
                      success: function (res) {
                      if (res.success) {
                               data = res
                               console.log(res.success)
                            }
      
                      else if (res.error) {
                                 data = res
                                 console.log(res.error)
                            }
                      }
                      })

                      console.log (data)
                      if (data.success){
                        var message = `Card ${card} has been blocked`
                      }
                      else if (data.error){
                        var message = 'There was a problem with the server'
                      }
                  }
                  else {
                    var message = 'Could not authenticate account'
                  }
                } 
              }
              else {
                var message = 'Wrong card number'
              }
            }
            if (Auth.error){
              var message = 'Account does not exist'
            }      
          }

          else if (formDataSerialized['cfc-bank-settings'] == 'travel-notification') {
            var AccountNumber = formDataSerialized['travel-notification-account']
            var date = formDataSerialized['travel-notification-date']
            Auth = authenticate(AccountNumber)
            if (Auth.user){
            var otp = prompt('Please enter the one time password sent to your device')
            if (otp == code){
            var data
                    $.ajax({
                      'async': false,
                      data: {AccountNumber: AccountNumber, TravelNotification: date},
                      type: 'POST',
                      url: '/travelnotification',
                      success: function (res) {
                      if (res.success) {
                               data = res
                               console.log(res.success)
                            }

                      else if (res.error) {
                                 data = res
                                 console.log(res.error)
                            }
                      }
                      })
                      if (data.success){
                        var message = `Your travel notification has been set on ${date}`}
                      else if (data.error){
                      var message = 'There was a problem with the server'}
            }
            else {
              var message = 'Could not authenticate the account'
            }}
            else if (Auth.error){
            var message ='Account does not exist'}

          }
  
          else if (formDataSerialized['cfc-bank-settings'] == 'spend-limit') {
            var amount = formDataSerialized['spend-limit-amount']
            var card = formDataSerialized['spend-limit-card']
            var AccountNumber = formDataSerialized['spend-limit-account']
            Auth = authenticate(AccountNumber)
            if (amount > 0){
              if (Auth.user) {
                if(Auth.data[0].CardNumber !== null){
                  // console.log(Auth.data[0].CardNumber)
                  // console.log(card)
                  if (Auth.data[0].CardNumber == card){
                    var otp = prompt('Please enter the one time password sent to your device')
                    if (otp == code){
                      var data
                      $.ajax({
                        'async': false,
                        data: {AccountNumber: AccountNumber, SpendLimit: amount},
                        type: 'POST',
                        url: '/spendlimit',
                        success: function (res) {
                        if (res.success) {
                                 data = res
                                //  console.log(res.success)
                              }
        
                        else if (res.error) {
                                   data = res
                                  //  console.log(res.error)
                              }
                        }
                        })
      
                        if (data.success) {
                          var message = `The spend limit for card ${card} has been set to GH${amount}`
                          if (Auth.data[0].CardBlock) {
                            var personalizedMessage = 'Your card is blocked. Contact the bank to have it unblocked'
                          }
                        } 
      
                        else if (data.error) {
                          var message = 'Something went wrong'
                        }
                    }
                    else {
                      var message = 'Could not authenticate the account'
                    }
                  }
                  else {
                    var message = 'This card number does not exist'
                  }
                }
                else {
                  var message = "You don't have a card set up"
                }
                
              }
  
              else if (Auth.error){
                var message = 'Account does not exist'
              }
        
            }
            else {
              var message = 'Please enter a valid spend limit'
            }
          }
  
          else if (formDataSerialized['cfc-bank-settings'] == 'freeze-account') {
            var AccountNumber = formDataSerialized['freeze-account-account']
            Auth = authenticate(AccountNumber)
            if (Auth.user){
              if (Auth.data[0].AccountFreeze == true){
                var otp = prompt('Please enter the one time password sent to your device')
                if (otp == code) {
                  var message = 'This account is already frozen'
                }
                else {
                  var message = 'Could not authenticate the account'
                }
              }
              else if (Auth.data[0].AccountFreeze == false) {
                var otp = prompt('Please enter the one time password sent to your device')
              if (otp == code){
                var data
                      $.ajax({
                        'async': false,
                        data: {AccountNumber: AccountNumber},
                        type: 'POST',
                        url: '/accountfreeze',
                        success: function (res) {
                        if (res.success) {
                                 data = res
                                //  console.log(res.success)
                              }
        
                        else if (res.error) {
                                   data = res
                                  //  console.log(res.error)
                              }
                        }
                        })

                        if (data.success) {
                          var message = `Account ${AccountNumber} has been frozen`
                        }
                        else if (data.error){
                          var message ='There was a problem with the server'
                        }
              }
              else {
                var message = 'Could not authenticate the account'
              } 
              }
            }
            else if (Auth.error){
              var message = 'This account does not exist'
            }
          }
        }

          else if (formDataSerialized['cfc-services'] == 'check-balance'){

            var AccountNumber = formDataSerialized['check-balance-account']
            Auth = authenticate(AccountNumber)
            // console.log(Auth)
            // console.log(Auth.data[0].FirstName)

            if (Auth.user) {
                    var otp = prompt('Please enter the one time password sent to your device')
                    if (otp == code){
                        var Balance = Auth.data[0].Balance
                        var FirstName = Auth.data[0].FirstName
                        var LastName = Auth.data[0].LastName
                        var message = `You have a balance of GH ${Balance}`
                        
                        if (Balance < 10000) {
                          var interest = 0
                        }
                        else if (Balance > 10000 && Balance < 50000) {
                          var interest = 1.7
                        }
                        else if (Balance > 50000 && Balance < 10000 ) {
                          var interest = 2.5
                        }
                        else if (Balance > 100000 && Balance < 500000) {
                          var interest = 4.0
                        } 
                        else {
                          var interest = 5.0
                        }

                        var personalizedMessage = `Dear ${LastName} ${FirstName}, with a balance of ${Balance} in your account, your interest on savings is ${interest}%`}
                    else {
                        var message = 'Could not authenticate the account'}
            }

            else if (Auth.error) {
            var message = 'Account does not exist.'
            }
            }

  
          else if (formDataSerialized['cfc-services'] == 'transfer-money') {
            var amount = formDataSerialized['transfer-money-amount']
            var recipient = formDataSerialized['transfer-money-recipient']
            var AccountNumber = formDataSerialized['transfer-money-account']
            Auth = authenticate(AccountNumber)
            if (Auth.user){
              if (Auth.data[0].Balance > amount){
                var otp = prompt('Please enter the one time password sent to your device')
                if (otp == code) {
                  var message = `An amount of ${amount} has been transferred to ${recipient}`
                }
                else {
                  var message = 'Could not authenticate the account'
                }
              }
              else {
                var otp = prompt('Please enter the one time password sent to your device')
                if (otp == code){
                  var message ='Transaction failed'
                }
                else {
                  var message = 'Could not authenticate the account'
                }
              }
              
            }
            else if (Auth.error){
              var message = 'Account does not exist'
            }
           
          }

          else if (formDataSerialized['cfc-services'] == 'loans') {

            function loan(loanaccount){
              var AccountNumber = loanaccount
              Auth = authenticate(AccountNumber)
              if (Auth.user) {
                var otp = prompt('Please enter the one time password sent to your device')
                if (otp == code) {
                  var CreditScore = Auth.data[0].CreditScore
                  if (CreditScore < 640) {
                    var loanmessage = 'Your credit score is not good enough for a mortgage type loan, or a mortgage loan. You can still get a conventional loan with a pay interest of 3.77%'
                  }
                  else if (CreditScore > 640 && CreditScore < 699){
                    var loanmessage = 'You have a fair credit score. Apply for a salary backed loan with an interest of 3.34%'
                  }
                  else if (CreditScore > 700 && CreditScore > 749) {
                    var loanmessage = 'Your credit score is good for a salary backed loan or employee manager loan. Apply for either with an interest of 3.126%'
                  }
                  else {
                    var loanmessage = 'You have an excellent credit score. Apply for any type of loan with an interest of 2.94%'
                  }
                  var message = loanmessage
                }
                else {
                  var message = 'Could not authenticate the account'
                }
              }
              else if (Auth.error) {
                var message = 'Account does not exist'
              }

              return message
            }

            if (formDataSerialized['cfc-loans'] == 'salary-loan'){
              var loanaccount = formDataSerialized['loanaccount1']
              message = loan(loanaccount)
            }
            else if (formDataSerialized['cfc-loans'] == 'employee-loan'){
              var loanaccount = formDataSerialized['loanaccount2']
              message = loan(loanaccount)
            }

            else if (formDataSerialized['cfc-loans'] == 'fast-loan'){
              var loanaccount = formDataSerialized['loanaccount3']
              message = loan(loanaccount)
            }
           
          }
        
        conversationalForm.addRobotChatResponse(message);
        conversationalForm.addRobotChatResponse(personalizedMessage)
        formDataSerialized['cfc-bank-settings'].length = 0;
        formDataSerialized['cfc-loans'].length = 0;
        console.log (formDataSerialized)
        conversationalForm.remapTagsAndStartFrom(1,1,true);


      }

    });

  };