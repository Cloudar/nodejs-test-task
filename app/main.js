/**
 * @author Timophey Molchanov <timopheym@gmail.com>
 * Date: 8/27/13 11:28 PM
 * Main client script
 */

connectToServer = function(data){
//  io.connect(data);
};

var Rooms = new Backbone.Marionette.Application();
Rooms.data = {
    rooms : {}
};
var UserModel = Backbone.Model.extend({
    defaults: {
        name: '%username%'
    }
});
var RoomModel = Backbone.Model.extend({
    defaults: {
        id: 0
    }
});
var StickerModel = Backbone.Model.extend({
    defaults: {
        id : 1,
        messages: [],
        x : 0,
        y: 0
    }
});

var RoomsCollection = Backbone.Collection.extend({
    model: RoomModel
});
var StickersCollection = Backbone.Collection.extend({
    model: StickerModel
});

Rooms.SignInFormView = Backbone.Marionette.ItemView.extend({
    events : {
      'click .signin-btn' : 'onSignInClick'
    },
    template: "#singin-template",
    onSignInClick : function () {
        var rooms = [$('#room_1').val(),$('#room_2').val(),$('#room_3').val(),$('#room_4').val()],
            name = $('.signin-user-name').val();
        connectToServer({
            rooms: rooms,
            name : name
        });
        /*Start rooms*/
        var roomsView = new Rooms.RoomsView();
        /*Array to collection*/
        for (var i in rooms){
            rooms[i] = {
                id : rooms[i]
            }
        }
        roomsView.collection = new RoomsCollection(rooms);
        roomsView.model = new UserModel({name : name});

        Rooms.mainRegion.show(roomsView);

        /*Start events*/
        var eventsView = new Rooms.EventsView();
        Rooms.helperRegion.show(eventsView);

    }
});

Rooms.addRegions({
    mainRegion: ".container",
    helperRegion: ".helper"
});

Rooms.on("initialize:after", function() {
    var signInFormView = new Rooms.SignInFormView();
    Rooms.mainRegion.show(signInFormView);
});

Rooms.StickerView = Backbone.Marionette.ItemView.extend({
    template: "#sticker-template"
});
Rooms.RoomView = Backbone.Marionette.ItemView.extend({
    template: "#room-template",
    events: {
        'click .room:not(.sticker)' : 'onMainClick',
        'click .sticker-numb' : 'onStickerClick',
        'click .sticker .close-btn' : 'onStickerCloseClick',
        'keydown .sticker input' : 'onStickerTextKeyDown'
    },
    onRender : function(){
        Rooms.data.rooms[this.model.id] = {};

        this.stickersView = new Rooms.StickersView();
        this.stickersView.collection = Rooms.data.rooms[this.model.id].stickers = new StickersCollection();
        this.$el.append(_.template($('#stickers-template').html()));
        console.log(this.$el.find('.stickers-wrapper'))
        this.stickersView.el = this.$el.find('.stickers-wrapper');
        this.stickersView.on("after:item:added", function(viewInstance) {
            console.log('Event item added')
        });

    },
    initialize : function(){

    },
    onStickerTextKeyDown : function(e) {
        /*If enter clicked*/
        if(event.keyCode == 13) {
            var message = $(e.target).val(),
                $messageDom = _.template($('#sticker-message-template').html(),{message: message});
            $(e.target).val('');
            $(e.target).parent().parent().find('.overview').append($messageDom);
            e.preventDefault();
            return false;
        }
    },
    onStickerCloseClick : function (e) {
        $(e.target).closest('.sticker').toggleClass('active');
    },
    onStickerClick : function (e) {
        $(e.target).parent().toggleClass('active');
    },
    onMainClick : function(e){
        /*If click on sticker*/
        if(($(e.target).attr('class') !== "undefined") && ($(e.target).attr('class').indexOf('sticker') > -1)) {
            return;
        }
        else {
            this.addSticker(e.offsetX-15, e.offsetY-15);
        }
    },
    addSticker : function (x,y) {
        console.log({id: this.stickersView.collection.length+1,
            x : x,
            y : y},'adding sticker')
        this.stickersView.collection.add({
            id: this.stickersView.collection.length+1,
            x : x,
            y : y
        });
        $sticker = $(_.template($('#sticker-template').html(),{id:this.stickersView.collection.length}));
        $sticker.css({
            left : x,
            top : y
        });
        $(this.$el.children('.room')[0]).append($sticker);
        $('.sc').tinyscrollbar();
    }
});
Rooms.RoomsView = Backbone.Marionette.CompositeView.extend({
    itemView: Rooms.RoomView,
    itemViewContainer: ".rooms",
    template: "#rooms-template"
});
Rooms.StickersView = Backbone.Marionette.CompositeView.extend({
    itemView: Rooms.StickerView,
    template: "#stickers-template",
    onAfterItemAdded : function () {
        console.log('added')
    }
});
Rooms.EventsView = Backbone.Marionette.CompositeView.extend({
    template: "#events-template"
});
Rooms.start();