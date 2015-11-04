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
    // add options to main category dropdown
    $.getJSON("../json/data.json", function(data) {
        $.each(data.大カテゴリ, function(index, val) {
            $("select[name$='main']").append('<option value=' + val + '>' + val + '</option>');
        })
    });

    var mainValidators = {
            row: '.col-xs-3', // The title is placed inside a <div class="col-xs-3"> element
            validators: {
                notEmpty: {
                    message: '大カテゴリを入力して下さい'
                }
            }
        },
        subValidators = {
            row: '.col-xs-3',
            validators: {
                notEmpty: {
                    message: '小カテゴリを入力して下さい'
                }
            }
        },
        phaseValidators = {
            row: '.col-xs-2',
            validators: {
                notEmpty: {
                    message: 'フェーズを入力して下さい'
                }
            }
        },
        timeValidators = {
            row: '.col-xs-2',
            validators: {
                notEmpty: {
                    message: '工数を入力して下さい'
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
                .attr('data-item-index', itemIndex)
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
        })
        // Remove button click handler
        .on('click', '.removeButton', function() {
            var $row = $(this).parents('.form-group'),
                index = $row.attr('data-item-index');

            // Remove fields
            $('#itemForm')
                .formValidation('removeField', $row.find('[name="item[' + index + '].main"]'))
                .formValidation('removeField', $row.find('[name="item[' + index + '].sub"]'))
                .formValidation('removeField', $row.find('[name="item[' + index + '].phase"]'))
                .formValidation('removeField', $row.find('[name="item[' + index + '].time"]'));

            // Remove element containing the fields
            $row.remove();
        })
        // add options to sub category according to main catagory
        .on("change", "select[name$='main']", function() {
            $selected = $(this);
            console.log($(this).val())
            $.getJSON("../json/data.json", function(data) {
                var prefix = $selected.attr('name').split('.')[0];

                var $sub = $("select[name='" + prefix + ".sub']");
                var $phase = $("select[name='" + prefix + ".phase']");
                $sub.empty().append("<option value=''>--小カテゴリ--</option>");
                $phase.empty().append("<option value=''>--フェーズ--</option>");

                // sub category read from data.json and append to select
                $.each(data[$selected.val()], function(index, val) {
                    /* iterate through array or object */
                    $sub.append('<option value=' + val + '>' + val + '</option>');
                });
                if ($selected.val() == 'モデル検証') {
                    $phase.attr('disabled', false);
                    $.each(data['フェーズ'], function(index, val) {
                        /* iterate through array or object */
                        $phase.append('<option value=' + val + '>' + val + '</option>');
                    });
                } else {
                    $phase.empty().append('<option value="-">-</option>')
                    $phase.attr('disabled', 'disabled');
                };
            });
        })
        // code loaded by jQuery need to use delegate
        .delegate('.clockpicker', 'focusin', function() {
            $(this).clockpicker();
        });
    //$('.clockpicker').clockpicker();
    $('#startTime').on('keyup paste', function() {
        $(".InputTxtR[name='StartTime']", top.frames["OPERATION"].document).val($(this).val());
    });
});

$('.testButton').click(function postContactToGoogle() {
    var name = 'test'; //$('#name').val();
    var email = 'test'; //$('#email').val();
    var feed = 'test'; //$('#feed').val();
    if ((name !== "") && (email !== "") && (feed !== "")) {
        $.ajax({
            url: "https://docs.google.com/a/g.softbank.co.jp/forms/d/11-1Jq2S79VXPf2sLad47YDYy_jf_wRNCQ66XLGPulaY/formResponse",
            data: {
                "entry_1390451542": 'name',
                "entry_1432710148": 'date',
                "entry_1886936430": 'year',
                "entry_57085600" : 'month',
                "entry_2128219038" : 'main',
                "entry_1933706906" : 'sub',
                "entry_195336712" : 'phase',
                "entry_354474307" : 'hour',
            },
            type: "POST",
            dataType: "xml",
            statusCode: {
                0: function() {
                    //Success message
                    console.log('good 0');
                },
                200: function() {
                    //Success Message
                    console.log('good 200');
                }
            }
        });
    } else {
        //Error message
        console.log('fail');
    }
});
