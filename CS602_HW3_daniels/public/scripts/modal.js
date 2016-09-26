(function ($, Handlebars) {
    "use strict";

    $("#deleteModal").on("show.bs.modal", function (event) {
        var $modal = $(this);

        var $button = $(event.relatedTarget) // Button that triggered the modal
        var fname = $button.data("fname");
        var lname = $button.data("lname");
        var id = $button.data("id"); // needed for the deleteEmployee service

        var $modalContent = $(".modal-body", $modal);

        var $cancelBtn = $(".btn-default", $modal);
        var $deleteButton = $modal.find(".btn-primary", $modal);
        $deleteButton.removeAttr("disabled");

        // modal content template
        var source = $("#template-modalMessage").html();
        var template = Handlebars.compile(source);
        var defaultHtml = template({});

        // update modal with default content
        $modalContent.html(defaultHtml); 

        // update modal template title with the Employee full name
        $modal.find(".modal-title").text("Delete Employee: " + lname + ", " + fname);

        // update modal content with default 
        
        $deleteButton.click(function (e) {
            var $btn = $(this).button('loading');

            // hide the cancel button after the user confirms the deletion of the employee if order to prevent closing the message
            $cancelBtn.hide();

            // prevent double submittion of the form by checking to see if it disabled and thus working.
            if (!this.hasAttribute("disabled")) {
                this.setAttribute("disabled", true);
                $.ajax({
                    type: "POST",
                    url: "/deleteEmployee",
                    data: { id: id },
                    dataType: "JSON"
                }).done(function (resp) {
                    // hard refresh (not from cache) the page to show the updated employee list. 
                    window.location = "/employees?delete=true";
                }).fail(function (resp) {
                    var errorHtml = template({ error: true });

                    // reset form  due to error in service call
                    $btn.button('reset');
                    $cancelBtn.show();

                    // update modal content with error message
                    $modalContent.html(errorHtml);
                });
            }
        });
    });

})($, Handlebars);