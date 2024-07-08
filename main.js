class YouTubeOldLayout {
  
    constructor() {
        console.log("Loaded Old YouTube Layout");

        const app = document.documentElement;
        this.pageObserver.observe(app, { childList: true, subtree: true, attributes: false });

        this.swapLayout();
        this.unblockScrolling();
        this.moveButtons();
        this.updateMetadata();
    }

    /**
     * Sets the layout of YouTube video player to old layout
     */
    async swapLayout() {
        const below = document.querySelector("ytd-watch-grid #primary #below");
        const secondary = document.querySelector("ytd-watch-grid #secondary");
    
        if (below && secondary) {
            const bottomGrid = document.querySelector("ytd-watch-grid #bottom-grid");
            const secondaryInner = secondary.querySelector("#secondary-inner");

            if (bottomGrid && secondaryInner) {
                secondaryInner.replaceWith(bottomGrid);
                below.appendChild(secondaryInner);
            }
        }
    }

    /**
     * Removes event listeners from HTMLDivElement, should be a DIV element
     * @param {HTMLDivElement} element Element from which EventListeners are removed
     * @param {keyof HTMLElementEventMap} type (Optional) Name of EventListener type to be blocked
     * @return HTMLDivElement without EventListenrs 
     */
    _removeEventListeners(element, type=null) {
        if (type && element.ylListener) {
            element.addEventListener(type, element.ylListener);
            
            return element;
        }

        const elementNew = element.cloneNode(false);
        
        // Move HTMLElements from element to elementNew
        while(element.firstChild) {
            elementNew.appendChild(element.firstChild);
        }

        // Blocking all EventListeners
        if (type) {
            const listener = (event) => { event.stopImmediatePropagation(); };
            elementNew.ylListener = listener;
            elementNew.addEventListener(type, listener);
        }

        if (element.parentElement) {
            element.replaceWith(elementNew);
        }

        return elementNew;
    } 

    /**
     * Unblocks scrolling for #secondary-inner div
     */
    unblockScrolling() {
        const secondaryInner = document.querySelector("ytd-watch-grid #secondary-inner");

        if (secondaryInner) {
            this._removeEventListeners(secondaryInner, "wheel");
        }
    }

    /**
     * Moves title out of description, and owner (subscribe button) above description
     */
    updateMetadata() {
        const metadata = document.querySelector("ytd-watch-grid #secondary-inner ytd-watch-metadata");
        if (metadata) {
            // Video title, video description, video owner (subscribe button)
            const title = metadata.querySelector("h1");
            const description = metadata.querySelector("#description");
            const owner = metadata.querySelector("#owner");

            // Layout of metadata: #title, #top-row, #middle-row, #bottom-row
            const rowTitle = metadata.querySelector("#title");
            const rowTop = metadata.querySelector("#top-row");
            const rowBottom = metadata.querySelector("#bottom-row");
            if (description && title && owner && (rowTitle.contains(title) || rowBottom.contains(owner))) {
                metadata.prepend(owner);
                metadata.prepend(title);
            }

            // Block click events on owner background
            if (owner) {
                this._removeEventListeners(owner, "click");
            }
        }
    }

    /**
     * Moves subscribe buttons to one row
     */
    moveButtons() {
        const owner = document.querySelector("ytd-watch-grid #secondary-inner ytd-video-owner-renderer");
        const bottomActions = document.querySelector("ytd-watch-grid #secondary-inner #bottom-actions");
        if (owner && bottomActions) {
            const menu = bottomActions.querySelector("ytd-menu-renderer");
            if (menu) {
                owner.after(bottomActions.querySelector("ytd-menu-renderer"));
                bottomActions.remove();
            }
        }
    }

    /**
     * Moves extend chat button to secondary
     */
    moveChat() {
        const chat = document.querySelector("ytd-watch-grid #chat-container");
        const secondary = document.querySelector("ytd-watch-grid #secondary");
        if (chat && secondary && secondary !== chat.parentElement) {
            secondary.prepend(chat);
            this.updateMetadata();
        }
    }

    /**
     * Moves extend playlist button to secondary
     */
    movePlaylist() {
        const playlist = document.querySelector("ytd-watch-grid #secondary-inner #playlist");
        const secondary = document.querySelector("ytd-watch-grid #secondary");
        if (secondary && playlist && !secondary !== playlist.parentElement) {
            secondary.prepend(playlist);
        }
    }
    
    pageObserver = new MutationObserver((mList) => {
        for (let m of mList) {
            for (let node of m.addedNodes) {
                switch (node.id) {
                    case "bottom-grid":
                    case "secondary-inner":
                        this.swapLayout();
                        this.unblockScrolling();
                        break;
                    case "chat-container":
                        this.moveChat();
                        break;
                    case "comments":
                        this.unblockScrolling();
                        break;
                    case "playlist":
                        this.movePlaylist();
                        break;
                    case "owner":
                        this.updateMetadata();
                        break;
                }

                switch (node.nodeName.toLowerCase()) {
                    case "ytd-menu-renderer":
                        this.moveButtons();
                        break;
                }
            }
        }
    });
  }
  
  var youTubeOldLayout = new YouTubeOldLayout();