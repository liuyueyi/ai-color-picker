<template>
    <view class="custom-popup" :class="{ 'popup-show': visible }" @tap.stop="handleMaskClick">
        <view class="popup-mask" @tap.stop="handleMaskClick"></view>
        <view class="popup-content" @tap.stop>
            <slot></slot>
        </view>
    </view>
</template>

<script>
export default {
    name: 'CustomPopup',
    props: {
        type: {
            type: String,
            default: 'center'
        },
        maskClosable: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            visible: false
        }
    },
    methods: {
        open() {
            this.visible = true
        },
        close() {
            this.visible = false
        },
        handleMaskClick() {
            if (this.maskClosable) {
                this.close()
            }
        }
    }
}
</script>

<style>
.custom-popup {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s;
}

.popup-show {
    visibility: visible;
    opacity: 1;
}

.popup-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4rpx);
}

.popup-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: all 0.3s;
}

.popup-show .popup-content {
    opacity: 1;
}
</style>