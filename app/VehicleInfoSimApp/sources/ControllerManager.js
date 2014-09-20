/**
 *
 * @file ControllerManager.js
 * @fileOverview
 * File containing the implementation of the ControllerManager singleton.
 *
 * @author Abalta Technologies, Inc.
 * @date July, 2014
 *
 * @cond Copyright
 *
 * COPYRIGHT 2014 ABALTA TECHNOLOGIES
 * ALL RIGHTS RESERVED.<p>
 * This program may not be reproduced, in whole or in
 * part in any form or any means whatsoever without the
 * written permission of ABALTA TECHNOLOGIES
 *
 * @endcond
 */

/**
 * @namespace Namespace of the current web application.
 */
window.abaltatech = window.abaltatech || {};

/**
 * @namespace Namespace for the controllers.
 */
window.abaltatech.controllers = window.abaltatech.controllers || {};

/**
 * Creates the singleton ControllerManager.
 * @class Represents the singleton ControllerManager. ControllerManager is responsible to initialize all controllers.
 * @param undefined Parameter is not passed to obtain the generic javascript undefined type.
 */
window.abaltatech.controllers.ControllerManager = (function (undefined) {

    /**
     * @exports instance as window.abaltatech.controllers.ControllerManager
     * @ignore
     */
    var instance = {};

    /**
     * Initializes all controllers.
     */
    instance.init = function() {
        window.abaltatech.controllers.IndexController.init();
    };

    return instance;
})();