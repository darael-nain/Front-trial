//Create a chat module to use.

var lastChatNotify = null;
var lastLoginNotify = null;

if(uVar.enableChatOnline && uVar.enableSocket){
  (function () {
    window.Chat = {
      socket : null,

      initialize : function(socketURL) {
        console.log('chat initialize');
        try{
          //this.socket = io.connect(socketURL,{ port: '/node' });
        }catch(err){
          console.log('node offline');
          console.log(err);
        }
        // if(typeof socketNew !== 'undefined'){
        //   document.querySelector('.nodeAlert').classList.add('nodeAlertHide');
        // }else{       
        //   document.querySelector('.nodeAlert').classList.remove('nodeAlertHide');
        // }

        //Send message on button click or enter
        $('html > body.menu > footer > article.chat > footer > button').click(function() {
          Chat.send();
        });

        $('html > body.menu > footer > article.chat > footer > input').keyup(function(evt) {
          if ((evt.keyCode || evt.which) == 13) {
            Chat.send();
            return false;
          }
        });

        //Process any incoming messages
    
        if(this.socket !== null){
          // this.socket.on('new', this.add);

          // this.socket.emit('msg', {
          //   login: {
          //     id: ($('html > body').data('username'))? $('html > body').data('username') : current_username,
          //     name: ($('html > body.menu > aside > div > div > h2').length? $('html > body.menu > aside > div > div > h2').text() : ''),
          //     ipaddr: $('html > body').data('ipaddr'),
          //     rut: companyRut.toString() || ""
          //   }
          // });
          
        }

        /*$('#viewport').bind('load', function() {
          var callee = function() {
            toastr.info('test: ' + $('html > body.menu.home > aside > div > div > h1').data('username'));
          };
          this.socket.emit('msg', {
            call: JSONfn.stringify(alert('aaa'));
          });
        });*/



        //setInterval(Chat.ping, 10000);
        var that = this;
        setInterval(function() {
          Chat.ping.call(that);
        }, 10000);

      },

      //Adds a new message to the chat.
      add : function(data) {

        //var name = data.name || 'anonymous';

        if (data.chat !== undefined && !access._583) {
          console.log('Data: ', data);
          var content = $('<h2>' + data.chat.name + ' <time datetime="' + new Date(data.chat.datetime).toISOString() + '" pubdate>' + new Date(data.chat.datetime).toLocaleDateString('es') + ' ' + new Date(data.chat.datetime).toLocaleTimeString('es') + '</time></h2><p>' + data.chat.msg + '</p>');

          $('html > body.menu > footer > article.chat > section')
            .append(content)
            .animate({scrollTop: $('html > body.menu > footer > article.chat > section').prop('scrollHeight')}, 0)
            .parent().show();

          if ($('html > body.menu > aside > div > div > h2').text() != data.chat.name) {
            if (lastChatNotify)
              lastChatNotify.remove();
            lastChatNotify = toastr.info(data.chat.msg, 'Mensaje de ' + data.chat.name.toLowerCase().replace(/^.|\s\S/g, function(a) { return a.toUpperCase(); }));
            var audio = $('<audio class="notify chat"><source src="/v3/audio/chat.mp3" type="audio/mpeg"></audio>').appendTo('html > body');
            audio.get(0).play();
            audio.on('ended', function() {
              audio.remove();
            });
          }
        }

        if (data.login !== undefined) {          
          if (data.login.name != "" && data.login.id != "vizkit" && data.login.id != "soporte" && (superUsers.indexOf(data.login.id)<0) ) {
             if (lastLoginNotify)
              lastLoginNotify.remove();
            lastLoginNotify = toastr.success(data.login.name.toLowerCase().replace(/^.|\s\S/g, function(a) { return a.toUpperCase(); }), 'Un usuario se conectó');
            var audio = $('<audio class="notify login"><source src="/v3/audio/chat.mp3" type="audio/mpeg"></audio>').appendTo('html > body');
            audio.get(0).play();
            audio.on('ended', function() {
              audio.remove();
            });
          }
        }

    
        if (data.users !== undefined) {
            var tooltip = function() {
              var usersList = new Array();
              for(var userId in data.users.list) {
                if (data.users.list[userId].username != null && data.users.list[userId].username != "") {
                    var userName = data.users.list[userId].username.replace(/\b./g, function(m){ return m.toUpperCase(); });
                    if ((usersList.indexOf(userName) == -1) && (data.users.list[userId].rut === companyRut )){
                      usersList.push(userName);
                    }
                }
              }
              return usersList.join("<br>");
            };

          var usersList = new Array();
          for(var userId in data.users.list) {
            if (data.users.list[userId].username != null && usersList.indexOf(data.users.list[userId].username) == -1) {
              usersList.push(data.users.list[userId].username);
            }
          }
          var usersNumber = usersList.length;

          var tooltipdata = tooltip();

          $('p.users > span:last-of-type')
            //.html(data.users.number)
            .html(usersNumber)
            //.attr('title', tooltip())
            //.tooltipster();
            .mouseover(function() {
              try {
                  $(this).tooltipster('destroy');
              } catch (e) {}
              $(this).tooltipster({
                  content: tooltip(),
                  contentAsHTML: true
              }).tooltipster('show');
            });
        }

        //backup 
        // if (data.users !== undefined) {
        //     var tooltip = function() {
        //       var usersList = new Array();
        //       for(var userId in data.users.list) {
        //         if (data.users.list[userId].username != null && data.users.list[userId].username != "") {
        //             var userName = data.users.list[userId].username.replace(/\b./g, function(m){ return m.toUpperCase(); });
        //             if (usersList.indexOf(userName) == -1)
        //               usersList.push(userName);
        //         }
        //       }
        //       return usersList.join("<br>");
        //     };

        //   var usersList = new Array();
        //   for(var userId in data.users.list) {
        //     if (data.users.list[userId].username != null && usersList.indexOf(data.users.list[userId].username) == -1) {
        //       usersList.push(data.users.list[userId].username);
        //     }
        //   }
        //   var usersNumber = usersList.length;

        //   var tooltipdata = tooltip();

        //   $('p.users > span:last-of-type')
        //     //.html(data.users.number)
        //     .html(usersNumber)
        //     //.attr('title', tooltip())
        //     //.tooltipster();
        //     .mouseover(function() {
        //       try {
        //           $(this).tooltipster('destroy');
        //       } catch (e) {}
        //       $(this).tooltipster({
        //           content: tooltip(),
        //           contentAsHTML: true
        //       }).tooltipster('show');
        //     });
        // }

        if (data.event !== undefined) {
            toastr.warning(data.event.detail, data.event.type);
            var audio = $('<audio class="notify event"><source src="/v3/audio/chat.mp3" type="audio/mpeg"></audio>').appendTo('html > body');
            audio.get(0).play();
            audio.on('ended', function() {
              audio.remove();
            });
        }

        if (data.notify !== undefined) {
            if (data.notify.username.toLowerCase() == ($('html > body.menu > aside > div > div > h2').length? $('html > body.menu > aside > div > div > h2').data('username') : v3_data_username).toLowerCase()) {
              switch(data.notify.type) {
                case 'success':
                  toastr.success(data.notify.message, data.notify.title, { onclick: JSONfn.parse(data.notify.callback) });
                  break;
                case 'info':
                  toastr.info(data.notify.message, data.notify.title, { onclick: JSONfn.parse(data.notify.callback) });
                  break;
                case 'warning':
                  toastr.warning(data.notify.message, data.notify.title, { onclick: JSONfn.parse(data.notify.callback) });
                  break;
                case 'error':
                  toastr.error(data.notify.message, data.notify.title, { onclick: JSONfn.parse(data.notify.callback) });
                  break;

                var audio = $('<audio class="notify event"><source src="/v3/audio/chat.mp3" type="audio/mpeg"></audio>').appendTo('html > body');
                audio.get(0).play();
                audio.on('ended', function() {
                  audio.remove();
                });

              }
            }
        }

       /* // Capturar llamadas de ejecución remota de funciones enviadas mediante Node.js
        if (data.call != 'undefined') {
          JSONfn.parse(data.call);
        }*/


      },

      //Sends a message to the server,
      //then clears it from the textarea
      send : function() {
        text = $('html > body.menu > footer > article.chat > footer > input').val();
        if (text != '') {
          // this.socket.emit('msg', {
          //   chat: {
          //     name: $('html > body.menu > aside > div > div > h2').text(),
          //     msg: text
          //   }
          // });

          $('html > body.menu > footer > article.chat > footer > input').val('');
        }

        return false;
      },

      // Broadcast message to all users
      notify: function(username, type, title, message, callback) {
        // this.socket.emit('msg', {
        //   notify: {
        //     username: username,
        //     type: type,
        //     title: title,
        //     message: message,
        //     callback: JSONfn.stringify(callback)
        //   }
        // });
      },

      ping: function() {
        //
        //

        if(this.socket !== null){
          //this.socket.emit('msg', {});
        }
      }

    };
  }());
  
}
