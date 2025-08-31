import { Routes } from '@angular/router';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { UserLayout } from './layouts/user-layout/user-layout';
import { NotFound } from './components/not-found/not-found';
import { Component } from "@angular/core";
import { AdminHome } from './components/admin-home/admin-home';
import { AdminPanel } from './components/admin-panel/admin-panel';
import path from 'path';
import { UserHome } from "./components/user-home/user-home";
import { MyAccount } from './components/my-account/my-account';
import { Transfer } from './components/transfer/transfer';
import { Login } from './components/login/login';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'login',component:Login,title:"Login"},
    {path: 'admin', component: AdminLayout, canActivate: [authGuard], data: { role: 'Admin' },children:[
        {path:'',redirectTo:'admin-home',pathMatch:'full'},
        {path:'admin-home',component:AdminHome,title:"Admin Home"},
        {path:'admin-panel',component:AdminPanel,title:"Admin Panel"}
    ] },
    {
        path: 'user', component: UserLayout, canActivate: [authGuard], data: { role: 'User' } ,children: [
        {path:'',redirectTo:'user-home',pathMatch:'full'},
        {path:'user-home',component:UserHome,title:"User Home"},
        {path:'my-account', loadComponent: () =>
        import('./components/my-account/my-account').then(m => m.MyAccount),title:"My Account"},
        {path:'transactions', loadComponent: () =>
        import('./components/transactions/transactions').then(m => m.Transactions),title:"Transactions"},
        {path:'transfer',component:Transfer,title:"Transfer"}
    ]
},
    {path:"**", component:NotFound,title:"Not Found"}
];

