(function () {
    "use strict";

    $("#deleteModal").on("show.bs.modal", function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var fname = button.data("fname");
        var lname = button.data("lname");
        var id = button.data("id");

        var modal = $(this);
        var deleteButton = modal.find(".btn-primary");
        deleteButton.removeAttr("disabled");

        modal.find(".modal-title").text("Delete Employee: " + lname + ", " + fname);
        
        deleteButton.click(function (e) {
            if (!this.hasAttribute("disabled")) {
                this.setAttribute("disabled", true);
                $.ajax({
                    type: "POST",
                    url: "/deleteEmployee",
                    data: { id: id },
                    dataType: "JSON"
                }).done(function (resp) {
                    console.log(resp, "success");
                    window.location.reload(true);
                }).fail(function (resp) {
                    console.log(resp, "failure");
                });
            }
        });
    });

})();