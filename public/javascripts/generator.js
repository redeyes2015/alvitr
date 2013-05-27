(function(window) {
  $.fn.serializeObject = function() {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
          if (o[this.name] !== undefined) {
              if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
          } else {
              o[this.name] = this.value || '';
          }
      });
      return o;
  };
  var Generator = {
    init: function() {
      $('form').change(function() {
        var params = $(this).serializeObject();
        //console.log(params);
        $('#previewImage').attr('src', '/img?' + $.param({q: JSON.stringify(params), _: $.now}));
      }).
      submit(function(evt) {
        evt.preventDefault();
      });
    }
  };

  $(function(){
    Generator.init();
    $('form').triggerHandler('change');
  });
}(this));
