import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { menusConfig } from "@/config/menus";
import { cn, translate } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default function MainMenu({ trans }: { trans: any }) {
  const menus = menusConfig.mainNav || [];

  const [offset, setOffset] = React.useState<number | null>(null);
  const [list, setList] = React.useState<HTMLUListElement | null | undefined>();
  const [value, setValue] = React.useState<string | null>();

  const onNodeUpdate = (trigger: any, itemValue: any) => {
    if (trigger && list && value === itemValue) {
      const triggerOffsetLeft = trigger.offsetLeft + trigger.offsetWidth / 6;

      setOffset(Math.round(triggerOffsetLeft));
    } else if (value === "") {
      setOffset(null);
    }
    return trigger;
  };

  return (
    <div>
      <NavigationMenu.Root
        onValueChange={setValue}
        className=" flex relative  justify-start group "
      >
        <NavigationMenu.List
          ref={setList}
          className="group flex list-none gap-5"
        >
          {menus?.map((item: any, index: number) => (
            <NavigationMenu.Item key={`item-${index}`} value={item}>
              {item.href ? (
                <NavigationMenu.Link asChild>
                  <Link
                    href={item.href}
                    className="flex items-center py-4 cursor-pointer group"
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium text-default-700">
                      {translate(item.title, trans)}
                    </span>
                  </Link>
                </NavigationMenu.Link>
              ) : (
                <>
                  <NavigationMenu.Trigger
                    ref={(node) => onNodeUpdate(node, item)}
                    asChild
                    className=" flex items-center"
                  >
                    <div className=" flex items-center  py-4 cursor-pointer group data-[state=open]:text-primary">
                      <item.icon className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium text-default-700">
                        {translate(item.title, trans)}
                      </span>
                      <ChevronDown
                        className="relative top-[1px] ml-1 h-4 w-4 transition duration-200 group-data-[state=open]:rotate-180"
                        aria-hidden="true"
                      />
                    </div>
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content
                    className={cn(
                      "w-full  rounded-md border bg-popover text-popover-foreground shadow-lg   "
                    )}
                  >
                    {item.child && (
                      <div className=" min-w-[200px] p-4">
                        {item.child?.map((childItem: any, index: number) => (
                          <ListItem
                            className="text-sm font-medium text-default-700"
                            key={`child-${index}`}
                            title={childItem.title}
                            href={childItem.href}
                            childItem={childItem}
                            trans={trans}
                          >
                            {childItem.icon && (
                              <childItem.icon className="h-5 w-5" />
                            )}
                          </ListItem>
                        ))}
                      </div>
                    )}
                  </NavigationMenu.Content>
                </>
              )}
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>

        <div className=" absolute  top-full ">
          <NavigationMenu.Viewport
            style={{
              display: !offset ? "none" : undefined,
              transform: `translateX(${offset}px)`,
              top: "100%",
              transition: "all 0.5s ease",
            }}
          />
        </div>
      </NavigationMenu.Root>
    </div>
  );
}

const ListItem = React.forwardRef<HTMLAnchorElement, any>(
  (
    { className, children, title, childItem, href, trans, ...props },
    forwardedRef
  ) => (
    <NavigationMenu.Link asChild>
      <Link
        href={href}
        className={cn(
          " select-none   text-sm  text-default-700 rounded-md flex  items-center gap-2 mb-4 last:mb-0  leading-none no-underline outline-none transition-colors  hover:text-primary  focus:text-primary",
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        <div>{children}</div>
        <div className=" capitalize">{translate(title, trans)}</div>
      </Link>
    </NavigationMenu.Link>
  )
);
