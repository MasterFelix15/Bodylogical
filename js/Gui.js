/**
 * Created by felix on 31/1/17.
 */
function Gui() {

    var controls = {

        gui: null,
        "Wire Frame": true,
        "a_value": 0.5,
        "b_value": 0.5,
        "c_value": 0.5,
        "d_value": 0.5,
        "speed": 0.33,
        "start_x": 0.66

    };

    var init = function() {

        controls.gui = new dat.GUI();

        var config = controls.gui.addFolder( 'Configurations' );
        var playback = controls.gui.addFolder( 'Playback' );
        var usr = controls.gui.addFolder( 'User Settings' );

        config.add( controls, "Wire Frame" ).onChange( controls.wireFrameToggle );
        config.add( controls, "a_value", 0, 1, 0.01 ).listen().onChange( controls.change_value_a );
        config.add( controls, "b_value", 0, 1, 0.01 ).listen().onChange( controls.change_value_b );
        config.add( controls, "c_value", 0, 1, 0.01 ).listen().onChange( controls.change_value_c );
        config.add( controls, "d_value", 0, 1, 0.01 ).listen().onChange( controls.change_value_d );

        playback.add( controls, "start" );
        playback.add( controls, "pause" );
        playback.add( controls, "reset" );

        usr.add( controls, "speed", 0, 1, 0.01 ).listen().onChange( controls.change_speed );
        usr.add( controls, "start_x", 0, 1, 0.01 ).listen().onChange( controls.change_start_x );

        config.open();
        playback.open();
        usr.open();

    };

    controls.start = function() {

        var startEvent = new CustomEvent( 'start-animation' );
        window.dispatchEvent( startEvent );

    };

    controls.reset = function() {

        var resetEvent = new CustomEvent( 'reset-animation' );
        window.dispatchEvent( resetEvent );

    };

    controls.pause = function() {

        var pauseEvent = new CustomEvent( 'pause-animation' );
        window.dispatchEvent( pauseEvent );

    };

    controls.change_value_a = function() {

        var value_a = { detail: { value: controls[ 'a_value' ] } };
        window.dispatchEvent( new CustomEvent( 'value-a-change', value_a ) );

    };

    controls.change_value_c = function() {

        var value_c = { detail: { value: controls[ 'c_value' ] } };
        window.dispatchEvent( new CustomEvent( 'value-c-change', value_c ) );

    };

    controls.change_value_b = function() {

        var value_b = { detail: { value: controls[ 'b_value' ] } };
        window.dispatchEvent( new CustomEvent( 'value-b-change', value_b ) );

    };

    controls.change_value_d = function() {

        var value_d = { detail: { value: controls[ 'd_value' ] } };
        window.dispatchEvent( new CustomEvent( 'value-d-change', value_d ) );

    };

    controls.change_speed = function() {

        var value_speed = { detail: { value: controls[ 'speed' ] } };
        window.dispatchEvent( new CustomEvent( 'speed-change', value_speed ) );

    };

    controls.change_start_x = function() {

        var value_sx = { detail: { value: controls[ 'start_x' ] } };
        window.dispatchEvent( new CustomEvent( 'start-x-change', value_sx ) );

    };

    controls.wireFrameToggle = function() {

        var data = {
            detail: {
                shouldShow: controls[ 'Wire Frame' ]
            }
        };

        window.dispatchEvent( new CustomEvent( 'toggle-wire-frame', data ) );

    };


    init.call( this );

}