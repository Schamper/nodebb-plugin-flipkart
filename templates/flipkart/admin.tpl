<div class="row">
    <div class="col-md-12">
        <h1>Flipkart</h1>
    </div>
</div>

<div class="row">
    <form class="form" id="flipkartAdminForm">
        <div class="col-xs-12 pull-left">
            <h3>Settings
                <small>change settings</small>
                <button id="save" class="btn btn-success btn-xs pull-right">Save</button>
            </h3>

            <hr>

            <div class="form-group">
                <label for="affiliateInput">Affiliate ID</label>
                <input type="text" class="form-control" id="affiliateInput" data-key="affiliateID">
            </div>
        </div>
    </form>
</div>

<script>
    require(['settings'], function (settings) {
        var wrapper = $('#flipkartAdminForm');
        settings.sync('flipkart', wrapper);
        $('#save').click(function(event) {
            event.preventDefault();
            settings.persist('flipkart', wrapper, function(){
                socket.emit('admin.plugins.flipkart.sync');
            });
        });
    });
</script>