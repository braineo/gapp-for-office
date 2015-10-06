$(document).ready(function() {
    var max_fields = 10; //maximum input boxes allowed
    var wrapper = $(".input_fields_wrap"); //Fields wrapper
    var add_button = $(".add_field_button"); //Add button ID

    var x = 1; //initlal text box count
    $(add_button).click(function(e) { //on add input button click
        e.preventDefault();
        if (x < max_fields) { //max input box allowed
            x++; //text box increment
            $(wrapper).append('<div><input type="text" name="mytext[]"/><a href="#" class="remove_field">Remove</a></div>'); //add input box
        }
    });

    $(wrapper).on("click", ".remove_field", function(e) { //user click on remove text
        e.preventDefault();
        $(this).parent('div').remove();
        x--;
    });


    $('.clockpicker').clockpicker();

    $("#main").change(function() {

        var $dropdown = $(this);

        $.getJSON("../json/data.json", function(data) {

            var key = $dropdown.val();
            var vals = [];

            switch (key) {
                case 'beverages':
                    vals = data.beverages.split(",");
                    break;
                case 'model':
                    vals = data.モデル検証;
                    break;
                case 'base':
                    vals = ['Please choose from above'];
            }

            var $jsontwo = $("#sub");
            $jsontwo.empty();
            $.each(vals, function(index, value) {
                $jsontwo.append("<option>" + value + "</option>");
            });

        });
    });
    var mainValidators = {
            row: '.col-xs-3', // The title is placed inside a <div class="col-xs-4"> element
            validators: {
                notEmpty: {
                    message: 'The title is required'
                }
            }
        },
        subValidators = {
            row: '.col-xs-3',
            validators: {
                notEmpty: {
                    message: 'The ISBN is required'
                },
                isbn: {
                    message: 'The ISBN is not valid'
                }
            }
        },
        phaseValidators = {
            row: '.col-xs-2',
            validators: {
                notEmpty: {
                    message: 'The price is required'
                },
                numeric: {
                    message: 'The price must be a numeric number'
                }
            }
        },
        timeValidators = {
            row: '.col-xs-2',
            validators: {
                notEmpty: {
                    message: 'The price is required'
                },
                numeric: {
                    message: 'The price must be a numeric number'
                }
            }
        },
        itemIndex = 0;
    $('#actionForm')
        .formValidation({
            framework: 'bootstrap',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'item[0].main': mainValidators,
                'item[0].sub': subValidators,
                'item[0].phase': phaseValidators,
                'item[0].time': timeValidators
            }
        })
        // Add button click handler
        .on('click', '.addButton', function() {
            itemIndex++;
            var $template = $('#actionTemplate'),
                $clone = $template
                .clone()
                .removeClass('hide')
                .removeAttr('id')
                .attr('data-book-index', bookIndex)
                .insertBefore($template);

            // Update the name attributes
            $clone
                .find('[name="main"]').attr('name', 'item[' + itemIndex + '].main').end()
                .find('[name="sub"]').attr('name', 'item[' + itemIndex + '].sub').end()
                .find('[name="phase"]').attr('name', 'item[' + itemIndex + '].phase').end()
                .find('[name="time"]').attr('name', 'item[' + itemIndex + '].time').end();

            // Add new fields
            // Note that we also pass the validator rules for new field as the third parameter
            $('#actionForm')
                .formValidation('addField', 'item[' + itemIndex + '].main', mainValidators)
                .formValidation('addField', 'item[' + itemIndex + '].sub', subValidators)
                .formValidation('addField', 'item[' + itemIndex + '].phase', phaseValidators)
                .formValidation('addField', 'item[' + itemIndex + '].time', timeValidators);
        });

});

function rowControl() {
    var row_nums = 1;
    var wrapper = $(".wrapper"); // row 
    $(".add-row").on('click', function(e) {
        row_nums++;
        var div = $(".row").clone()
        div.find(".option0").attr("id", function(i, id) {
            return id.replace(/\d+/, row_nums)
        });
        div.find(".option1").attr("id", function(i, id) {
            return id.replace(/\d+/, row_nums)
        });
        div.find(".option2").attr("id", function(i, id) {
            return id.replace(/\d+/, row_nums)
        });
        $(".row").append(div)
    });
};
