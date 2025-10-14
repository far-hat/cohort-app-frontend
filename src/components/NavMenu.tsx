import { CoursesMenu } from "./CoursesMenu"
import { QuizMenu } from "./QuizMenu"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu"
import UsernameMenu from "./UsernameMenu"

export const NavMenu = ()=> {
    return(
        <NavigationMenu>
            <NavigationMenuList>
                
                <NavigationMenuItem>
                    <UsernameMenu/>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}