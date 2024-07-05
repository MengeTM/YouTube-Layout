class YouTubeOldLayout {
  
    constructor() {
        console.log("Loaded Old YouTube Layout");

        const app = document.documentElement;
        this.pageObserver.observe(app, { childList: true, subtree: true, attributes: false });

        this.swapLayout();
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
     * Moves title out of description, and owner (subscribe button) above description
     */
    updateMetadata() {
        const metadata = document.querySelector("ytd-watch-grid #secondary-inner ytd-watch-metadata");
        if (metadata) {
            // Video title, video description, video owner (subscribe button)
            const title = metadata.querySelector("h1");
            const description = metadata.querySelector("#description");
            const owner = metadata.querySelector("#owner");

            // Block click events on owner background
            if (owner && !owner.querySelector("#yl-block-clicks")) {
                const blockClicks = document.createElement("div");

                blockClicks.id = "yl-block-clicks";
                blockClicks.style.position = "absolute";
                blockClicks.style.top = "0px";
                blockClicks.style.right = "0px";
                blockClicks.style.bottom = "0px";
                blockClicks.style.left = "0px";
                blockClicks.style.zIndex = "0";
                blockClicks.addEventListener("click", (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                });

                owner.style.position = "relative";
                owner.prepend(blockClicks);
            }
            // Layout of metadata: #title, #top-row, #middle-row, #bottom-row
            const rowTitle = metadata.querySelector("#title");
            const rowTop = metadata.querySelector("#top-row");
            const rowBottom = metadata.querySelector("#bottom-row");
            if (description && title && owner && rowTitle.contains(title)) {
                metadata.prepend(owner);
                metadata.prepend(title);
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
                        break;
                    case "chat-container":
                        this.moveChat();
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