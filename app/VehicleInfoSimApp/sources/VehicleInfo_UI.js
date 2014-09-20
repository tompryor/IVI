/**
 *
 * @file VehicleDataLocalStorage.js
 * @fileOverview
 * File containing the implementation for the VehicleDataStorage class.
 *
 * @author Abalta Technologies, Inc.
 * @date July 2014
 *
 * @cond Copyright
 *
 * COPYRIGHT 2014 ABALTA TECHNOLOGIES ALL RIGHTS RESERVED.<p>
 * This program may not be reproduced, in whole or in
 * part in any form or any means whatsoever without the
 * written permission of ABALTA TECHNOLOGIES or "CUSTOMER
 * NAME".
 *
 * @endcond
 */

/**
 * @namespace Namespace of the current web application.
 */
window.abaltatech = window.abaltatech || {};
window.abaltatech.vehicleinfo_sim = window.abaltatech.vehicleinfo_sim || {};

window.vehicledata = window.vehicledata || {};
var ns_vehicleinfo = window.abaltatech.vehicleinfo_sim;

/**
 * All within the same namespace.
 */
window.vehicledata.VehicleInfo_UI = (function () {
    var instance = {};
    
    /**
     * Loads the information saved in local storage onto the screen. 
     */
    instance.load = function(){  
        
        ns_vehicleinfo._startSimulation(); 
        
        instance.vehicleObj = window.navigator.vehicle; 
//        instance.vehicleObj.brake.set({"fluidLevel" : 144}); 
//        instance.vehicleObj.brake.set({"padWear" : 555}, ns_vehicleinfo.Zone.RIGHT);
        var textInputStartID = 5000; // Initial ID value
        var textInputID = parseInt(textInputStartID);
        var vehicleValueTextInputElements = [];

        for(var vehInfoName in instance.vehicleObj) {
            
            console.debug("Adding " + vehInfoName);
            
            // Check if this is a VehicleInterface object
            if (instance.vehicleObj[vehInfoName].constructor === window.abaltatech.vehicleinfo_sim.VehicleInterface) {
                
                // Insert record in the table and checbox
                var checkboxHTML = $('<input type="checkbox" id="' + vehInfoName + '"/>').prop('available', instance.vehicleObj[vehInfoName].available());
                var propertyNameHTML = $('<td class="property-title" colspan="2"></td>').html(vehInfoName);
                var content = $('<tr></tr>')
                        .append($('<td class="checkbox-cell"></td>').append(checkboxHTML))
                        .append(propertyNameHTML)
                        .append('<td></td>');
                $('#vehicleInfo').append(content);
                
                console.debug($('#vehicleInfo'));
                
                vehicleInfo = instance.vehicleObj[vehInfoName]; 
                
                // Show the checkbox when loaded on the screen
                if(vehicleInfo.available() === "available") {
                    $(checkboxHTML).prop('checked', true);
                }
                
                // Get and add the sub-values
                var vehicleValueNames = vehicleInfo._getValueNames();
                console.debug('value names');
                console.debug(vehicleValueNames);
                $.each( vehicleValueNames, function(zone, subPropertyName) {
                    console.debug(subPropertyName);
                    if(zone === "None") {
                        zone = "";
                    }                    
                    // Only properties that don't start with underscore are valid
                        // Add to the table the value and an edit box
                        for ( var index in subPropertyName.values) {
                            console.debug("Zone: " + zone.values);
                            var textbox = $('<input type="text" id="' + textInputID + '" value="' + vehicleInfo._getValue(subPropertyName.values[index], zone || 'None') + '" style="text-align: center; width: 150px">');

                            // Create an array that inputs both the property and subproperties
                            vehicleValueTextInputElements[textInputID - textInputStartID] = {vehicleInfo: vehInfoName, vehicleValue: subPropertyName.values[index]}; 

                            // Change the ID of each textbox
                            textInputID++;
                            
                            // How the boxes appear on the screen. 
                           $('#vehicleInfo').append(($('<tr class="properties"></tr>'))
                                   .append($('<td></td>'))
                                   .append($('<td class="zone-cell">' + zone + '</td>'))
                                   .append($('<td></td>').html(subPropertyName.values[index]))
                                   .append($('<td></td>').html(textbox)));

                        }
                });
                
          
            }
            
            // propertyName is what you want
            // you can get the value like this: myObject[propertyName]
         }
         
        // Saving the values inputting in both the checkboxes and the textboxes
        $('#save').click(function() {
            // Get all the text values.
            for( var index in vehicleValueTextInputElements ) {

                var vehicleInfo = instance.vehicleObj[vehicleValueTextInputElements[index].vehicleInfo];
                var textInputID = (textInputStartID + parseInt(index)).toString();
                vehicleInfo._setValue( vehicleValueTextInputElements[index].vehicleValue,$('#' + textInputID).val(), $('#' + textInputID).parent().siblings('.zone-cell').html());
                //vehicleInfo.set({"speed" : 2000});                
            }

            // Save the available flag
            for(var vehInfoName in instance.vehicleObj) {

                // Check if this is a VehicleInterface object
                if (instance.vehicleObj[vehInfoName].constructor === window.abaltatech.vehicleinfo_sim.VehicleInterface) {
                    var vehicleInfo = instance.vehicleObj[vehInfoName];
                    if( $('#' + vehInfoName).prop('checked') ) {
                        vehicleInfo._setAvailable( window.abaltatech.vehicleinfo_sim.Availability.AVAILABLE);
                    } else {
                        vehicleInfo._setAvailable(  window.abaltatech.vehicleinfo_sim.Availability.NOT_SUPPORTED );
                    }

                }
            }

        });                

        // Updates the current status of the file
        function updateStatus(status) {
        	console.debug("Updating status to " + status);
            $('#currentStatus').html(status);
        }
        
        // Changes the status of the file
        $('#files').on('change', function(evt) {
            var files = evt.target.files; // FileList object
            $('#currentFile').html('<strong>' + files[0].name + '</strong> (<span id="currentStatus">' + ns_vehicleinfo._getFileSimulationStatus() + '</span>)');            
        });

        // Calling the playback simulation function
        $('#play').click(function () {
        	switch(ns_vehicleinfo._getFileSimulationStatus()) {
        	case 'not started' : 
        		console.debug('case not started');
                document.getElementById("play").value="pause";
                ns_vehicleinfo._startFileSimulation ( $("#files").prop('files'), 1000, true);
                break;   
            case 'running' :
                document.getElementById("play").value="play";
                ns_vehicleinfo._pauseFileSimulation();
            	console.debug("case running: " + ns_vehicleinfo._getFileSimulationStatus());  
            	break;
            case 'paused' :
                document.getElementById("play").value="pause";
                ns_vehicleinfo._resumeFileSimulation();
            	console.debug("case paused: " + ns_vehicleinfo._getFileSimulationStatus());   
            	break;
            case 'error' :
                console.error("There was an error in reading the file");
            default :  
            	console.error("Something went wrong.");

        	}
 
            updateStatus(ns_vehicleinfo._getFileSimulationStatus());
        });

        // Calls stop simulation when the stop button is clicked
        $('#stop').click(function () {
        	console.debug("Stopping.");
           ns_vehicleinfo._stopFileSimulation();
           document.getElementById("play").value="play";
           updateStatus(ns_vehicleinfo._getFileSimulationStatus());
        });

    };

    
    instance.m_systemVehicleInfoProperties = ["available","supported"]; // Properties that we want to skip
    
    /*
     * Checks if the strings are valid subProperties
     */
    instance.isValidSubpropertyName = function(subPropertyName) {
 
         return !(subPropertyName.substring(0,1) === "_") && !(subPropertyName.substring(0,2) === "m_") &&
                (instance.m_systemVehicleInfoProperties.indexOf(subPropertyName) === -1); 
        
    };

    return instance;
    })();

