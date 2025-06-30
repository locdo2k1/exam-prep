<template>
  <aside :class="[
    'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
    {
      'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
      'lg:w-[90px]': !isExpanded && !isHovered,
      'translate-x-0 w-[290px]': isMobileOpen,
      '-translate-x-full': !isMobileOpen,
      'lg:translate-x-0': true,
    },
  ]" @mouseenter="!isExpanded && (isHovered = true)" @mouseleave="isHovered = false">
    <div :class="[
      'py-8 flex',
      !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
    ]">
      <router-link to="/">
        <img v-if="isExpanded || isHovered || isMobileOpen" class="dark:hidden" src="/images/logo/logo-admin.png"
          alt="Logo" width="150" height="40" />
        <img v-if="isExpanded || isHovered || isMobileOpen" class="hidden dark:block"
          src="/images/logo/logo-admin-dark.png" alt="Logo" width="150" height="40" />
        <img v-else src="/images/logo/logo-icon.png" alt="Logo" width="32" height="32" />
      </router-link>
    </div>
    <div class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2 :class="[
              'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
              !isExpanded && !isHovered
                ? 'lg:justify-center'
                : 'justify-start',
            ]">
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button v-if="item.subItems" @click="toggleSubmenu(groupIndex, index)" :class="[
                  'menu-item group w-full',
                  {
                    'menu-item-active': isSubmenuOpen(groupIndex, index),
                    'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                  },
                  !isExpanded && !isHovered
                    ? 'lg:justify-center'
                    : 'lg:justify-start',
                ]">
                  <span :class="[
                    isSubmenuOpen(groupIndex, index)
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive',
                  ]">
                    <component :is="item.icon" />
                  </span>
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{ item.name }}</span>
                  <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen" :class="[
                    'ml-auto w-5 h-5 transition-transform duration-200',
                    {
                      'rotate-180 text-brand-500': isSubmenuOpen(
                        groupIndex,
                        index
                      ),
                    },
                  ]" />
                </button>
                <template v-else>
                  <div :class="[
                    'menu-item group',
                    {
                      'menu-item-active': item.path && isActive(item.path),
                      'menu-item-inactive': !item.path || !isActive(item.path),
                      'cursor-default': !item.path,
                      'cursor-pointer': !!item.path
                    },
                  ]" @click="item.path && $router.push(item.path)">
                    <span :class="[
                      (item.path && isActive(item.path))
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]">
                      <component :is="item.icon" />
                    </span>
                    <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{ item.name }}</span>
                  </div>
                </template>
                <transition @enter="startTransition" @after-enter="endTransition" @before-leave="startTransition"
                  @after-leave="endTransition">
                  <div v-show="isSubmenuOpen(groupIndex, index) &&
                    (isExpanded || isHovered || isMobileOpen)
                    ">
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="(subItem, subIndex) in item.subItems" :key="subItem.name">
                        <!-- First level submenu item -->
                        <div v-if="subItem.subItems && subItem.subItems.length" class="space-y-1">
                          <div @click.stop="toggleSubmenu(groupIndex, index, subIndex)" :class="[
                            'menu-dropdown-item cursor-pointer',
                            {
                              'menu-dropdown-item-active': isAnySubmenuActive(subItem),
                              'menu-dropdown-item-inactive': !isAnySubmenuActive(subItem),
                            },
                          ]">
                            {{ subItem.name }}
                            <ChevronDownIcon :class="[
                              'ml-auto w-4 h-4 transition-transform duration-200',
                              {
                                'rotate-180': isSubmenuOpen(groupIndex, index, subIndex),
                              },
                            ]" />
                          </div>
                          <!-- Second level submenu -->
                          <transition @enter="startTransition" @after-enter="endTransition" @before-leave="startTransition"
                            @after-leave="endTransition">
                            <ul v-show="isSubmenuOpen(groupIndex, index, subIndex)" class="mt-1 space-y-1 ml-4">
                              <li v-for="nestedItem in subItem.subItems" :key="nestedItem.name">
                                <router-link :to="nestedItem.path" :class="[
                                  'menu-dropdown-item block',
                                  {
                                    'menu-dropdown-item-active': isActive(nestedItem.path),
                                    'menu-dropdown-item-inactive': !isActive(nestedItem.path),
                                  },
                                ]">
                                  {{ nestedItem.name }}
                                </router-link>
                              </li>
                            </ul>
                          </transition>
                        </div>
                        <!-- Regular submenu item (no nested submenu) -->
                        <router-link v-else :to="subItem.path" :class="[
                          'menu-dropdown-item block',
                          {
                            'menu-dropdown-item-active': isActive(subItem.path),
                            'menu-dropdown-item-inactive': !isActive(subItem.path),
                          },
                        ]">
                          {{ subItem.name }}
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <SidebarWidget v-if="isExpanded || isHovered || isMobileOpen" />
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  PieChartIcon,
  ChevronDownIcon,
  HorizontalDots,
  PageIcon,
  TableIcon,
  ListIcon,
  PlugInIcon,
  BoxCubeIcon
} from "@/icons";
import SidebarWidget from "@/components/admin/layout/SidebarWidget.vue";
import { useSidebar } from "@/composables/useSidebar";
import StaredIcon from "@/icons/StaredIcon.vue";
import SettingsIcon from "@/icons/SettingsIcon.vue";
import QuestionBankIcon from "@/icons/QuestionBankIcon.vue";
import CategoryIcon from "@/icons/CategoryIcon.vue";

const route = useRoute();

const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

const menuGroups = [
  {
    title: "Menu",
    items: [
      {
        icon: GridIcon,
        name: "Dashboard",
      },
      {
        icon: QuestionBankIcon,
        name: "Question Bank",
        subItems: [
          {
            name: "Questions",
            path: "/admin/question-management",
            subItems: [
              {
                name: "List Questions",
                path: "/admin/question-management"
              },
              {
                name: "Create Question",
                path: "/admin/question-management/create"
              }
            ]
          },
          {
            name: "Question Sets",
            path: "/admin/question-sets",
            subItems: [
              {
                name: "List Sets",
                path: "/admin/question-sets"
              },
              {
                name: "Create Set",
                path: "/admin/question-sets/create"
              }
            ]
          }
        ]
      },
      {
        icon: UserCircleIcon,
        name: "User Profiles",
        path: "",
      },
      {
        name: "Test Exam",
        icon: ListIcon,
        path: "",
      },
      {
        name: "Question Set",
        icon: TableIcon,
        path: "",
      },
      {
        name: "Type and Cateogry",
        icon: CategoryIcon,
        path: "",
      },
      {
        name: "Certificate",
        icon: StaredIcon,
        path: "",
      },
      {
        name: "Settings",
        icon: SettingsIcon,
        path: "",
      },
    ],
  },
];

const isActive = (path) => route.path === path;

const isAnySubmenuActive = (item) => {
  if (isActive(item.path)) return true;
  if (item.subItems) {
    return item.subItems.some(subItem => isAnySubmenuActive(subItem));
  }
  return false;
};

const toggleSubmenu = (groupIndex, itemIndex, subIndex = null) => {
  if (subIndex !== null) {
    const key = `${groupIndex}-${itemIndex}-${subIndex}`;
    openSubmenu.value = openSubmenu.value === key ? null : key;
  } else {
    const key = `${groupIndex}-${itemIndex}`;
    openSubmenu.value = openSubmenu.value === key ? null : key;
  }
};

const isSubmenuOpen = (groupIndex, itemIndex, subIndex = null) => {
  if (subIndex !== null) {
    const key = `${groupIndex}-${itemIndex}-${subIndex}`;
    const item = menuGroups[groupIndex].items[itemIndex];
    const subItem = item.subItems?.[subIndex];
    
    if (!subItem) return false;
    
    return (
      openSubmenu.value === key ||
      (subItem.subItems?.some(nestedItem => isActive(nestedItem.path)))
    );
  } else {
    const key = `${groupIndex}-${itemIndex}`;
    const item = menuGroups[groupIndex].items[itemIndex];
    
    if (!item.subItems) return false;
    
    return (
      openSubmenu.value === key ||
      item.subItems.some(subItem => 
        isActive(subItem.path) || 
        (subItem.subItems?.some(nestedItem => isActive(nestedItem.path)))
      )
    );
  }
};

const startTransition = (el) => {
  el.style.height = "auto";
  const height = el.scrollHeight;
  el.style.height = "0px";
  el.offsetHeight; // force reflow
  el.style.height = height + "px";
};

const endTransition = (el) => {
  el.style.height = "";
};
</script>
