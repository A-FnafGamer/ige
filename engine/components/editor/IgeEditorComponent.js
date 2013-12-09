/**
 * When added to a viewport, automatically adds entity rotate
 * capabilities to the selected entity in the scenegraph viewer.
 */
var IgeEditorComponent = IgeEventingClass.extend({
	classId: 'IgeEditorComponent',
	componentId: 'editor',

	/**
	 * @constructor
	 * @param {IgeObject} entity The object that the component is added to.
	 * @param {Object=} options The options object that was passed to the component during
	 * the call to addComponent.
	 */
	init: function (entity, options) {
		var self = this;
		
		this._entity = entity;
		this._options = options;
		this._showStats = 0;
		
		this.ui = {};
		
		// Load jsRender for HTML template support
		ige.requireScript(igeRoot + 'components/editor/vendor/jsRender.js');
		
		// Load jQuery, the editor will use it for DOM manipulation simplicity
		ige.requireScript(igeRoot + 'components/editor/vendor/jquery.2.0.3.min.js');
		
		ige.on('allRequireScriptsLoaded', function () {
			// Load editor html into the DOM
			self.loadHtml(igeRoot + 'components/editor/root.html', function (html) {
				// Add the html
				$('body').append($(html));
				
				// Object mutation observer polyfill
				ige.requireScript(igeRoot + 'components/editor/vendor/observe.js');
				
				// Load plugin styles
				ige.requireStylesheet(igeRoot + 'components/editor/vendor/treeview_simple/css/style.css');
				
				// Load the editor stylesheet
				ige.requireStylesheet(igeRoot + 'components/editor/css/editor.css');
				
				// Listen for scenegraph tree selection updates
				ige.on('sgTreeSelectionChanged', function (objectId) {
					self._objectSelected(ige.$(objectId));
				});
				
				// Wait for all required files to finish loading
				ige.on('allRequireScriptsLoaded', function () {
					// Load UI scripts
					ige.requireScript(igeRoot + 'components/editor/ui/panels/panels.js');
					
					ige.requireScript(igeRoot + 'components/editor/ui/scenegraph/scenegraph.js');
					ige.requireScript(igeRoot + 'components/editor/ui/toolbox/toolbox.js');
					
					// Load jquery plugins
					ige.requireScript(igeRoot + 'components/editor/vendor/autoback.jquery.js');
					ige.requireScript(igeRoot + 'components/editor/vendor/tree/tree.jquery.js');
					ige.requireScript(igeRoot + 'components/editor/vendor/tabs/tabs.jquery.js');
					ige.requireScript(igeRoot + 'components/editor/vendor/treeview_simple/treeview_simple.jquery.js');
					
					ige.on('allRequireScriptsLoaded', function () {
						// Observe changes to the engine to update our display
						Object.observe(ige, function (changes) {
							changes.forEach(function (change) {
								switch (change.name) {
									case '_fps':
										// Update the fps
										$('#fpsCounter').html(ige._fps + ' fps');
										break;
								}
							});
						});
						
						// Add auto-backing
						$('.backed').autoback();
						
						// Call finished on all ui instances
						for (var i in self.ui) {
							if (self.ui.hasOwnProperty(i)) {
								if (self.ui[i].ready) {
									self.ui[i].ready();
								}
							}
						}
						
						// Enable tabs
						$('.tabGroup').tabs();
					});
				}, null, true);
			});
		}, null, true);
		
		// Set the component to inactive to start with
		this._enabled = true;
		
		this.log('Init complete');
	},
	
	loadHtml: function (url, callback) {
		$.ajax({
			url: url,
			success: callback,
			dataType: 'html'
		});
	},

	/**
	 * Gets / sets the enabled flag. If set to true, 
	 * operations will be processed. If false, no operations will
	 * occur.
	 * @param {Boolean=} val
	 * @return {*}
	 */
	enabled: function (val) {
		var self = this;

		if (val !== undefined) {
			this._enabled = val;
			return this._entity;
		}

		return this._enabled;
	},
	
	selectObject: function (id) {
		if (id !== undefined) {
			if (id) {
				this._selectedObject = ige.$(id);
				this._objectSelected(this._selectedObject);
			} else {
				delete this._selectedObject;
			}
		}
	},
	
	_objectSelected: function (obj) {
		if (obj) {
			ige.editor.ui.panels.showPanelByInstance(obj);
			this.emit('selectedObject', obj.id());
		}
	},
	
	/**
	 * Updates the stats HTML overlay with the latest data.
	 * @private
	 */
	_statsTick: function () {
		var self = ige.editor,
			i,
			watchCount,
			watchItem,
			itemName,
			res,
			html = '';

		// Check if the stats output is enabled
		if (self._showStats && !self._statsPauseUpdate) {
			switch (self._showStats) {
				case 1:
					/*if (self._watch && self._watch.length) {
						watchCount = self._watch.length;

						for (i = 0; i < watchCount; i++) {
							watchItem = self._watch[i];

							if (typeof(watchItem) === 'string') {
								itemName = watchItem;
								try {
									eval('res = ' + watchItem);
								} catch (err) {
									res = '<span style="color:#ff0000;">' + err + '</span>';
								}
							} else {
								itemName = watchItem.name;
								res = watchItem.value;
							}
							html += i + ' (<a href="javascript:ige.watchStop(' + i + '); ige._statsPauseUpdate = false;" style="color:#cccccc;" onmouseover="ige._statsPauseUpdate = true;" onmouseout="ige._statsPauseUpdate = false;">Remove</a>): <span style="color:#7aff80">' + itemName + '</span>: <span style="color:#00c6ff">' + res + '</span><br />';
						}
						html += '<br />';
					}*/
					/*html += '<div class="sgButton" title="Show / Hide SceneGraph Tree" onmouseup="ige.toggleShowEditor();">Scene</div> <span class="met" title="Frames Per Second">' + self._fps + ' fps</span> <span class="met" title="Draws Per Second">' + self._dps + ' dps</span> <span class="met" title="Draws Per Tick">' + self._dpt + ' dpt</span> <span class="met" title="Update Delta (How Long the Last Update Took)">' + self._updateTime + ' ms\/ud</span> <span class="met" title="Render Delta (How Long the Last Render Took)">' + self._renderTime + ' ms\/rd</span> <span class="met" title="Tick Delta (How Long the Last Tick Took)">' + self._tickTime + ' ms\/pt</span>';

					if (self.network) {
						// Add the network latency too
						html += ' <span class="met" title="Network Latency (Time From Server to This Client)">' + self.network._latency + ' ms\/net</span>';
					}

					self._statsDiv.innerHTML = html;*/
					
					
					break;
			}
		}
	},
	
	addToSgTree: function (item) {
		var elem = document.createElement('li'),
			arr,
			arrCount,
			i,
			mouseUp,
			dblClick,
			timingString;

		mouseUp = function (event) {
			event.stopPropagation();

			var elems = document.getElementsByClassName('sgItem selected');
			for (i = 0; i < elems.length; i++) {
				elems[i].className = 'sgItem';
			}

			this.className += ' selected';
			ige._sgTreeSelected = this.id;

			ige._currentViewport.drawBounds(true);
			if (this.id !== 'ige') {
				ige._currentViewport.drawBoundsLimitId(this.id);
			} else {
				ige._currentViewport.drawBoundsLimitId('');
			}
			
			ige.emit('sgTreeSelectionChanged', ige._sgTreeSelected);
		};

		dblClick = function (event) {
			event.stopPropagation();
			console.log("ige.$('" + this.id + "')");
		};

		//elem.addEventListener('mouseover', mouseOver, false);
		//elem.addEventListener('mouseout', mouseOut, false);
		elem.addEventListener('mouseup', mouseUp, false);
		elem.addEventListener('dblclick', dblClick, false);

		elem.id = item.id;
		elem.innerHTML = item.text;
		elem.className = 'sgItem';

		if (ige._sgTreeSelected === item.id) {
			elem.className += ' selected';
		}

		if (igeConfig.debug._timing) {
			if (ige._timeSpentInTick[item.id]) {
				timingString = '<span>' + ige._timeSpentInTick[item.id] + 'ms</span>';
				/*if (ige._timeSpentLastTick[item.id]) {
					if (typeof(ige._timeSpentLastTick[item.id].ms) === 'number') {
						timingString += ' | LastTick: ' + ige._timeSpentLastTick[item.id].ms;
					}
				}*/

				elem.innerHTML += ' ' + timingString;
			}
		}

		document.getElementById(item.parentId + '_items').appendChild(elem);

		if (item.items) {
			// Create a ul inside the li
			elem = document.createElement('ul');
			elem.id = item.id + '_items';
			document.getElementById(item.id).appendChild(elem);

			arr = item.items;
			arrCount = arr.length;

			for (i = 0; i < arrCount; i++) {
				ige.addToSgTree(arr[i]);
			}
		}
	},
	
	toggleShowEditor: function () {
		this._showSgTree = !this._showSgTree;

		if (this._showSgTree) {
			// Create the scenegraph tree
			var self = this,
				elem1 = document.createElement('div'),
				elem2,
				canvasBoundingRect;
			
			canvasBoundingRect = ige._canvasPosition();

			elem1.id = 'igeSgTree';
			elem1.style.top = (parseInt(canvasBoundingRect.top) + 5) + 'px';
			elem1.style.left = (parseInt(canvasBoundingRect.left) + 5) + 'px';
			elem1.style.height = (ige._geometry.y - 30) + 'px';
			elem1.style.overflow = 'auto';
			elem1.addEventListener('mousemove', function (event) {
				event.stopPropagation();
			});
			elem1.addEventListener('mouseup', function (event) {
				event.stopPropagation();
			});
			elem1.addEventListener('mousedown', function (event) {
				event.stopPropagation();
			});

			elem2 = document.createElement('ul');
			elem2.id = 'sceneGraph_items';
			elem1.appendChild(elem2);

			document.body.appendChild(elem1);
			
			// Create the IGE console
			var consoleHolderElem = document.createElement('div'),
				consoleElem = document.createElement('input'),
				classChainElem = document.createElement('div'),
				dociFrame = document.createElement('iframe');

			consoleHolderElem.id = 'igeSgConsoleHolder';
			consoleHolderElem.innerHTML = '<div><b>Console</b>: Double-Click a SceneGraph Object to Script it Here</div>';
			
			consoleElem.type = 'text';
			consoleElem.id = 'igeSgConsole';
			
			classChainElem.id = 'igeSgItemClassChain';

			dociFrame.id = 'igeSgDocPage';
			dociFrame.name = 'igeSgDocPage';

			consoleHolderElem.appendChild(consoleElem);
			consoleHolderElem.appendChild(classChainElem);
			consoleHolderElem.appendChild(dociFrame);
			
			document.body.appendChild(consoleHolderElem);

			this.sgTreeUpdate();
			
			// Now add a refresh button to the scene button
			var button = document.createElement('input');
			button.type = 'button';
			button.id = 'igeSgRefreshTree'
			button.style.position = 'absolute';
			button.style.top = '0px';
			button.style.right = '0px'
			button.value = 'Refresh';
			
			button.addEventListener('click', function () {
				self.sgTreeUpdate();
			}, false);
			
			document.getElementById('igeSgTree').appendChild(button);
			
			// Add basic editor controls
			var editorRoot = document.createElement('div'),
				editorModeTranslate = document.createElement('input'),
				editorModeRotate = document.createElement('input'),
				editorModeScale = document.createElement('input'),
				editorStatus = document.createElement('span');
			
			editorRoot.id = 'igeSgEditorRoot';
			editorStatus.id = 'igeSgEditorStatus';
			
			editorModeTranslate.type = 'button';
			editorModeTranslate.id = 'igeSgEditorTranslate';
			editorModeTranslate.value = 'Translate';
			editorModeTranslate.addEventListener('click', function () {
				// Disable other modes
				ige.editorRotate.enabled(false);
				
				if (ige.editorTranslate.enabled()) {
					ige.editorTranslate.enabled(false);
					self.log('Editor: Translate mode disabled');
				} else {
					ige.editorTranslate.enabled(true);
					self.log('Editor: Translate mode enabled');
				}
			});
			
			editorModeRotate.type = 'button';
			editorModeRotate.id = 'igeSgEditorRotate';
			editorModeRotate.value = 'Rotate';
			editorModeRotate.addEventListener('click', function () {
				// Disable other modes
				ige.editorTranslate.enabled(false);
				
				if (ige.editorRotate.enabled()) {
					ige.editorRotate.enabled(false);
					self.log('Editor: Rotate mode disabled');
				} else {
					ige.editorRotate.enabled(true);
					self.log('Editor: Rotate mode enabled');
				}
			});
			
			editorModeScale.type = 'button';
			editorModeScale.id = 'igeSgEditorScale';
			editorModeScale.value = 'Scale';
			
			editorRoot.appendChild(editorModeTranslate);
			editorRoot.appendChild(editorModeRotate);
			editorRoot.appendChild(editorModeScale);
			editorRoot.appendChild(editorStatus);
			
			document.body.appendChild(editorRoot);
			
			// Add the translate component to the ige instance
			ige.addComponent(IgeEditorTranslateComponent);
			ige.addComponent(IgeEditorRotateComponent);
			
			// Schedule tree updates every second
			ige._sgTreeUpdateInterval = setInterval(function () { self.sgTreeUpdate(); }, 1000);
		} else {
			// Kill interval
			clearInterval(ige._sgTreeUpdateInterval);
			
			var child = document.getElementById('igeSgTree');
			child.parentNode.removeChild(child);

			child = document.getElementById('igeSgConsoleHolder');
			child.parentNode.removeChild(child);
			
			child = document.getElementById('igeSgEditorRoot');
			child.parentNode.removeChild(child);
			
			ige.removeComponent('editorTranslate');
			ige.removeComponent('editorRotate');
		}
	},
	
	sgTreeUpdate: function () {
		// Update the scenegraph tree
		document.getElementById('sceneGraph_items').innerHTML = '';

		// Get the scenegraph data
		this.addToSgTree(this.getSceneGraphData(this, true));
	},
});